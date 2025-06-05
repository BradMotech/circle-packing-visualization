import * as d3 from 'd3';
import { RenderCirclePackingModel } from 'src/app/core/models/country.model';

import { FormatNumberPipe } from 'src/app/shared/pipes/format-population-area.pipe';

const formatter = new FormatNumberPipe();

export function renderCirclePacking(props: RenderCirclePackingModel) {
  // Desructuring props here for a clear access to passed-down data
  const { element, onSelect, data } = props;
  const width = 600;
  const height = 600;

  d3.select(element).html(''); // Clear previous render
  let root: any;
  let node: any;
  let circles: any;
  let countryLabels: any;
  let pack = d3.pack().size([width, height]).padding(25);
  let color = d3.scaleOrdinal(d3.schemeCategory10);

  const container = d3
    .select(element)
    .style('display', 'flex')
    .style('flex-direction', 'column')
    .style('gap', '12px')
    .style('position', 'relative');

  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('flex-shrink', '0');
  // Added region filter dropdown above toggle
  const regionFilterContainer = container
    .append('div')
    .style('display', 'flex')
    .style('align-items', 'center')
    .style('gap', '8px')
    .style('font-family', 'sans-serif');

  regionFilterContainer
    .append('label')
    .attr('for', 'region')
    .text('Region :')
    .style('font-weight', 'bold');

  const regionSelect = regionFilterContainer
    .append('select')
    .attr('id', 'region')
    .style('font-size', '14px')
    .style('padding', '2px 6px')
    .style('cursor', 'pointer')
    .style('height', '45px')
    .style('width', '320px')
    .style('margin-left', '20px')
    .style('border-radius', '8px');

  const regions = [
    'All',
    'Northern Europe',
    'Western Europe',
    'Southern Europe',
    'Eastern Europe',
  ];

  regionSelect
    .selectAll('option')
    .data(regions)
    .enter()
    .append('option')
    .attr('value', (d) => d)
    .text((d) => d);

  // toggle container
  const toggleContainer = container
    .append('div')
    .style('display', 'flex')
    .style('gap', '10px')
    .style('align-items', 'center');

  toggleContainer
    .append('label')
    .text('Size by:')
    .style('font-weight', '600')
    .style('font-size', '14px')
    .style('font-family', 'sans-serif')
    .style('margin-right', '12px')
    .style('color', '#333')
    .style('display', 'inline-block')
    .style('padding', '4px 8px')
    .style('border-radius', '4px')
    .style('background-color', '#f3f4f6');

  // Radio buttons for toggle
  const toggleValues = ['population', 'area'];
  let currentToggle = 'population';

  let filteredData = data; // starts with full data

  const radios = toggleContainer
    .selectAll('label.toggle-option')
    .data(toggleValues)
    .enter()
    .append('label')
    .attr('class', 'toggle-option')
    .style('font-family', 'sans-serif')
    .style('cursor', 'pointer')
    .style('user-select', 'none')
    .style('margin-right', '12px')
    .style('display', 'inline-flex')
    .style('align-items', 'center')
    .style('padding', '6px 10px')
    .style('border', '1px solid #ccc')
    .style('border-radius', '6px')
    .style('background-color', '#f9fafb')
    .style('transition', 'background-color 0.2s, border-color 0.2s')
    .on('mouseover', function () {
      d3.select(this)
        .style('background-color', '#e5e7eb')
        .style('border-color', '#999');
    })
    .on('mouseout', function () {
      d3.select(this)
        .style('background-color', '#f9fafb')
        .style('border-color', '#ccc');
    });

  radios
    .append('input')
    .attr('type', 'radio')
    .attr('name', 'size-toggle')
    .attr('value', (d) => d)
    .property('checked', (d) => d === currentToggle)
    .style('margin-right', '6px')
    .style('accent-color', '#3b82f6') // Tailwind's blue-500
    .on('change', function (event, d) {
      currentToggle = d;
      updateCountrySizes();
    });

  radios
    .append('span')
    .text((d) => d.charAt(0).toUpperCase() + d.slice(1))
    .style('color', '#111')
    .style('font-size', '14px');

  radios.append('span').text((d) => d.charAt(0).toUpperCase() + d.slice(1));

  // Initial hierarchy sum by population
  root = d3
    .hierarchy(data)
    .sum((d: any) => d.data?.population || 1)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  pack(root);

  node = svg
    .selectAll('g')
    .data(root.descendants().filter((d: any) => d.depth > 0))
    .enter()
    .append('g')
    .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

  circles = node
    .append('circle')
    .attr('r', (d: any) => d.r)
    .attr('fill', (d: any) =>
      d.children
        ? '#e8e8e8'
        : color(d.data.country || d.data.name || d.name || 'Unknown')
    )
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .style('cursor', (d: any) => (!d.children ? 'pointer' : 'default'))
    .on('click', (event: any, d: any) => {
      if (!d.children) {
        onSelect(d.data);
        showSidebar(d.data);
      }
    });

  countryLabels = node
    .append('text')
    .attr('dy', '0.3em')
    .style('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('pointer-events', 'none')
    .style('fill', '#fff')
    .text((d: any) =>
      d.r > 20 ? d.data.country || d.data.name || d.data.name || 'Unknown' : ''
    );

  // Function to (re)render the visualization with a given dataset
  function render(dataToRender: any) {
    // Clear svg for re-render
    svg.selectAll('*').remove();

    // Create hierarchy and pack layout
    root = d3
      .hierarchy(dataToRender)
      .sum((d: any) => d.population || 1)
      .sort((a: any, b: any) => (b.value ?? 0) - (a.value ?? 0));
    pack(root);

    node = svg
      .selectAll('g')
      .data(root.descendants().filter((d: any) => d.depth > 0))
      .enter()
      .append('g')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

    circles = node
      .append('circle')
      .attr('r', (d: any) => d.r)
      .attr('fill', (d: any) =>
        d.children
          ? '#1e283a'
          : color(d.data.country || d.data.name || d.name || 'Unknown')
      )
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .style('cursor', (d: any) => (!d.children ? 'pointer' : 'default'))
      .on('click', (event: any, d: any) => {
        if (!d.children) {
          onSelect(d.data);
          showSidebar(d.data);
        }
      });

    countryLabels = node
      .append('text')
      .attr('dy', '0.3em')
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('pointer-events', 'none')
      .style('fill', '#fff')
      .style('font-weight', '800')
      .text((d: any) =>
        d.r > 20 ? d.data.country || d.data.name || d.name || 'Unknown' : ''
      );

    updateCountrySizes();
  }

  // Filtering based on selected region
  function filterCountriesByRegion(region: string) {
    if (region === 'All') {
      filteredData = data;
    } else {
      const europe = data.children[0]; // Main level
      const filteredSubRegionData = europe.children.find(
        (subregion: any) => subregion.name === region
      );
      // Going a second level deep to find the countries matching the supplied region
      if (filteredSubRegionData) {
        filteredData = {
          ...data,
          children: [{ ...europe, children: [filteredSubRegionData] }],
        };
      } else {
        filteredData = { ...data, children: [] }; // Here i fallback if no region matching supplied region found
      }
    }
  }

  // Event handler for region select change
  regionSelect.on('change', (event: any) => {
    const selectedRegion = event.target.value;
    filterCountriesByRegion(selectedRegion);
    render(filteredData);
  });

  // Function to update circle sizes on toggle
  function updateCountrySizes() {
    // Recalculating values based on toggle
    root.sum((d: any) => {
      if (currentToggle === 'population') return d.data?.population || 1;
      if (currentToggle === 'area') return d.data?.land_area_km2 || 1;
      return 1;
    });

    pack(root);

    // Update radii with smooth transition
    circles
      .transition()
      .duration(700)
      .attr('r', (d: any) => d.r);

    // Update countryLabels visibility based on new radius
    countryLabels
      .transition()
      .duration(700)
      .style('opacity', (d: any) => (d.r > 20 ? 1 : 0));
  }

  // Initial render with full data
  filteredData = data;
  render(filteredData);
  // Initial render sizes are by population (This i left by default currently, but can be toggled to area)
  updateCountrySizes(); // Method updates the sizes of the countries

  if (!document.getElementById('country-info-sidebar')) {
    const sidebar = document.createElement('div');
    sidebar.id = 'country-info-sidebar';
    document.body.appendChild(sidebar);
  }

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
        height: 100vh;
        background-color: #fff;
        box-shadow: -4px 0 15px rgba(0,0,0,0.1);
        padding: 24px;
        transition: right 0.4s ease;
        z-index: 9999;
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
      #country-info-sidebar a {
        color: #1e283a;
        text-decoration: none;
      }
      #country-info-sidebar a:hover {
        text-decoration: underline;
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
      .pie-svg {
        margin-top: 24px;
      }
      .toggle-option input {
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

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
    <h1 style="color: #1e283a; margin-top: 22px;">Showing ${
      data.data.country
    }</h1>
    <img src=${data.data.flag} style="width:100%"/>
    <p><strong>Country:</strong> ${data.data.country}</p>
    <p><strong>Population:</strong> ${
      data.data.population
        ? formatter.transform(data.data.population, 'population')
        : 'N/A'
    }</p>
    <p><strong>Land Area:</strong> ${
      data.data.land_area_km2
        ? formatter.transform(data.data.land_area_km2, 'area')
        : 'N/A'
    }</p>
    <p><strong>Learn more on Wikipedia:</strong>
      <a style="color: #007bff;" href="https://en.wikipedia.org/wiki/${encodeURIComponent(
        data.data.country
      )}" target="_blank">${data.data.country}</a>
    </p>
  `;
  }
}
