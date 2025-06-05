import * as d3 from 'd3';
import { RenderCirclePackingModel } from 'src/app/core/models/country.model';
import { FormatNumberPipe } from 'src/app/shared/pipes/format-population-area.pipe';

const formatter = new FormatNumberPipe();

export function renderBarChart(props: RenderCirclePackingModel) {
  const { element, onSelect, data } = props;
  const width = 800;
  const height = 600;
  const margin = { top: 85, right: 35, bottom: 85, left: 105 };

  d3.select(element).html(''); // Clearing previous render to have a clean render of the chart

  // Here i will Flatten region > subregion > country to get country info (country,population,area etc)
  const flattenCountries = (node: any): any[] => {
    const countries: any[] = [];
    if (node.children) {
      node.children.forEach((child: any) => {
        if (child.children) {
          countries.push(...flattenCountries(child));
        } else {
          countries.push({
            ...child.data,
            country: child.name,
            region: node.name,
          });
        }
      });
    }
    return countries;
  };

  const allCountries = flattenCountries(data);
  let filteredData = [...allCountries];
  let currentToggle: 'population' | 'area' = 'population';

  // Setup container
  const container = d3
    .select(element)
    .style('display', 'flex')
    .style('flex-direction', 'column')
    .style('gap', '12px');

  const controls = container
    .append('div')
    .style('display', 'flex')
    .style('gap', '20px');

  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  const legendContainer = container
    .append('div')
    .style('display', 'flex')
    .style('flex-wrap', 'wrap')
    .style('gap', '10px')
    .style('padding', '0 20px 20px 100px');
  // Region Select
  const regionSelect = controls
    .append('select')
    .style('padding', '2px 6px')
    .style('cursor', 'pointer')
    .style('height', '45px')
    .style('width', '320px')
    .style('margin-left', '20px')
    .style('border-radius', '8px');
  const regions = ['All', ...new Set(allCountries.map((d) => d.region))];

  regionSelect
    .selectAll('option')
    .data(regions)
    .enter()
    .append('option')
    .style('font-weight', 'bold')
    .attr('value', (d) => d)
    .text((d) => d);

  // Toggle: population / area
  const toggleWrapper = controls
    .append('div')
    .style('display', 'flex')
    .style('gap', '10px')
    .style('cursor', 'pointer')
    .style('height', '45px')
    .style('width', '100%')
    .style('margin-left', '20px')
    .style('border-radius', '8px');
  toggleWrapper
    .append('span')
    .text('Size by:')
    .style('color', '##333')
    .style('text-align', 'center')
    .style('display', 'flex')
    .style('padding', '12px 12px');

  const toggleValues: ('population' | 'area')[] = ['population', 'area'];
  toggleWrapper
    .selectAll('label')
    .data(toggleValues)
    .enter()
    .append('label')
    .style('cursor', 'pointer')
    .style('border-radius', '8px')
    .style('margin-right', '8px')
    .style('padding', '12px 12px')
    .style('text-align', 'center')
    .style('items-align', 'center')
    .style('justify-items', 'center')
    .style('border', '1px solid #ccc')
    .style('border-radius', '6px')
    .style('background-color', (d) =>
      d === currentToggle ? '#007bff' : '#fff'
    )
    .style('color', (d) => (d === currentToggle ? '#fff' : '#333'))
    .style('font-weight', '500')
    .style('font-family', 'sans-serif')
    .style('transition', 'all 0.2s ease-in-out')
    .html(
      (d) =>
        `<input type="radio" name="toggle" value="${d}" ${
          d === currentToggle ? 'checked' : ''
        } style="display:none"/>${d.charAt(0).toUpperCase() + d.slice(1)}`
    )
    .on('click', function (event: any, d: any) {
      currentToggle = d;
      toggleWrapper
        .selectAll('label')
        .style('background-color', (d2) => (d2 === d ? '#007bff' : '#fff'))
        .style('color', (d2) => (d2 === d ? '#fff' : '#333'));

      renderChart();
    });

  const regionColor = d3
    .scaleOrdinal<string, string>()
    .domain(regions.filter((r) => r !== 'All'))
    .range(d3.schemeTableau10);

  function renderChart() {
    svg.selectAll('*').remove();

    const x = d3
      .scaleLinear()
      .range([margin.left, width - margin.right])
      .domain([
        0,
        d3.max(filteredData, (d: any) =>
          currentToggle === 'population' ? d.population : d.land_area_km2
        ) || 1,
      ]);

    const y = d3
      .scaleBand()
      .range([margin.top, height - margin.bottom])
      .padding(0.2)
      .domain(filteredData.map((d: any) => d.country));

    svg
      .selectAll('.bar')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('x', margin.left)
      .attr('y', (d) => y(d.country)!)
      .attr(
        'width',
        (d) =>
          x(currentToggle === 'population' ? d.population : d.land_area_km2) -
          margin.left
      )
      .attr('height', y.bandwidth())
      .attr('fill', (d) => regionColor(d.region))
      .on('click', (event: any, d: any) => {
        onSelect(d);
        showSidebar(d);
      });

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr('font-size', '12px');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .attr('font-size', '12px');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(
        `Country ${
          currentToggle === 'population' ? 'Population' : 'Land Area'
        } Bar Chart`
      );
  }

  function renderLegend() {
    legendContainer.selectAll('*').remove(); // Clear existing

    const legendData = regions.filter((r) => r !== 'All');

    const legendItems = legendContainer
      .selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('div')
      .attr('class', 'legend-item')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('gap', '6px');

    legendItems
      .append('div')
      .style('width', '14px')
      .style('height', '14px')
      .style('border-radius', '2px')
      .style('background-color', (d) => regionColor(d));

    legendItems
      .append('span')
      .text((d) => d)
      .style('font-size', '12px')
      .style('color', '#444');
  }

  function filterByRegion(region: string) {
    filteredData =
      region === 'All'
        ? allCountries
        : allCountries.filter((d: any) => d.region === region);
    renderChart();
    renderLegend();
  }

  regionSelect.on('change', function () {
    filterByRegion(this.value);
  });

  renderChart();
  renderLegend();

  // Method to render sidebar on selection
  function showSidebar(data: any) {
    let sidebar = document.getElementById('country-info-sidebar');
    if (!sidebar) {
      sidebar = document.createElement('div');
      sidebar.id = 'country-info-sidebar';
      document.body.appendChild(sidebar);
    }
    sidebar.className = 'show';
    sidebar.innerHTML = `
    <button class="close-btn" onclick="document.getElementById('country-info-sidebar').classList.remove('show')">Close</button>
    <h1 style="color: #1e283a; margin-top: 22px;">Showing ${data.country}</h1>
    <img src=${data.flag} style="width:100%"/>
    <p><strong>Country:</strong> ${data.country}</p>
    <p><strong>Population:</strong> ${
      data.population
        ? formatter.transform(data.population, 'population')
        : 'N/A'
    }</p>
    <p><strong>Land Area:</strong> ${
      data.land_area_km2
        ? formatter.transform(data.land_area_km2, 'area')
        : 'N/A'
    }</p>
    <p><strong>Learn more on Wikipedia:</strong>
      <a style="color: #007bff;" href="https://en.wikipedia.org/wiki/${encodeURIComponent(
        data.country
      )}" target="_blank">${data.country}</a>
    </p>
  `;
  }

  // Sidebar Styles
  if (!document.getElementById('sidebar-style')) {
    const style = document.createElement('style');
    style.id = 'sidebar-style';
    style.textContent = `
      #country-info-sidebar {
        position: fixed;
        top: 0;
        right: -400px;
        width: 360px;
        max-width: 90vw;
        margin-top:89px;
        height: 100vh;
        background-color: #fff;
        box-shadow: -4px 0 15px rgba(0,0,0,0.1);
        padding: 24px;
        transition: right 0.4s ease;
        z-index: 9999999;
        overflow-y: auto;
        font-family: 'Segoe UI', sans-serif;
      }
      #country-info-sidebar.show {
        right: 0;
      }
      #country-info-sidebar h2 {
        margin-top: 0;
        color: #222;
      }
      #country-info-sidebar p {
        font-size: 14px;
        color: #444;
        margin: 10px 0;
      }
      #country-info-sidebar .close-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        background: #1e283a;
        color: white;
        border: none;
        padding: 6px 10px;
        cursor: pointer;
        border-radius: 4px;
        font-size: 12px;
      }
    `;
    document.head.appendChild(style);
  }
}
