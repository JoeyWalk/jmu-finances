import * as d3 from 'd3';
import * as d3Sankey from "d3-sankey";

const width = 928;
const height = 600;
const format = d3.format(",.0f");
const linkColor = "source-target"; // source, target, source-target, or a color string.

// Create a SVG container.
const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

// Constructs and configures a Sankey generator.
const sankey = d3Sankey.sankey()
  .nodeId(d => d.name)
  .nodeAlign(d3Sankey.sankeyJustify) // d3.sankeyLeft, etc.
  .nodeWidth(15)
  .nodePadding(10)
  .extent([[1, 5], [width - 1, height - 5]]);

// leftmost nodes: football, men's basketball, women's basketball, other sports, non-program specific
function getNodes4Col1() {
  return [
    {name: "football" , title: "football"},
    {name: "men's basketball", title: "men's basketball"},
    {name: "women's basketball", title: "women's basketball"},
    {name: "other sports", title: "other sports"},
    {name: "non-program specific", title: "non-program specific"}
  ];
}

// second-to-leftmost nodes: JMU Athletics (positive) Revenue items (e.g. Ticket sales, etc.)
function getNodes4Col2(data) {
  let nodes = [];
  for ( let i = 0; i < data.length; i++ ) {
    if (data[i].type === "Operating Revenues") {
      let dataName = data[i].name;
      nodes.push({name: dataName, title: dataName, location: i});
    }
  }
  return nodes;
}

// center node: JMU Athletics
function getNodes4Col3(data) {
  return [{name: "JMU Athletics" , title: "JMU Athletics"}];
}

// second-to-rightmost nodes: JMU Athletics Expense categories (negative revenue) (e.g. Athletic student aid, etc.)
function getNodes4Col4(data) {
  let nodes = [];
  for ( let i = 0; i < data.length; i++ ) {
    if (data[i].type === "Operating Expenses") {
      let dataName = data[i].name;
      if (dataName === "Guarantees") {
        nodes.push({name: dataName + " Expenses", title: dataName, location: i});
      } else {
        nodes.push({name: dataName, title: dataName, location: i});
      }
    }
  }
  return nodes;
}

// rightmost nodes: football, men's basketball, women's basketball, other sports, non-program specific
function getNodes4Col5() {
  return [
    {name: "footballEnd" , title: "football"},
    {name: "men's basketballEnd", title: "men's basketball"},
    {name: "women's basketballEnd", title: "women's basketball"},
    {name: "other sportsEnd", title: "other sports"},
    {name: "non-program specificEnd", title: "non-program specific"}
  ];
}

// Diagram 4 Node code
function getNode4(data) {
  const nodes = [];
  nodes.push(...getNodes4Col1());
  nodes.push(...getNodes4Col2(data));
  nodes.push(...getNodes4Col3());
  nodes.push(...getNodes4Col4(data));
  nodes.push(...getNodes4Col5());
  console.log("nodes in getNode4: " , nodes);
  return nodes;
}

function getLinks1and2(data) {
  const links = [];
  const col2 = getNodes4Col2(data);
  for (let i = 0; i < col2.length; i++) {
    let footballLink = {source: "football", value: data[col2[i].location].Football, target: col2[i]["name"]};
    let menBasketballLink = {source: "men's basketball", value: data[col2[i].location]["Men's Basketball"], target: col2[i]["name"]};
    let womenBasktballLink = {source: "women's basketball", value: data[col2[i].location]["Women's Basketball"], target: col2[i]["name"]};
    let otherLink = {source: "other sports", value: data[col2[i].location]["Other sports"], target: col2[i]["name"]};
    let nonSpecific = {source: "non-program specific", value: data[col2[i].location]["Non-Program Specific"], target: col2[i]["name"]};
    links.push(footballLink);
    links.push(menBasketballLink);
    links.push(womenBasktballLink);
    links.push(otherLink);
    links.push(nonSpecific);
  }
  console.log("col 1 to 2 links: " , links)
  return links;
}

// The links connecting columns 2 and 3
function getLinks2and3(data) {
  const links = [];
  const col2 = getNodes4Col2(data);
  for (let i = 0; i < col2.length; i++) {
    let newLink = {source: col2[i]["name"], value: data[col2[i].location]["Total"], target: "JMU Athletics"};
    links.push(newLink);
  }
  console.log("col 2 to 3 links: " , links)
  return links;
}

// The links connecting columns 3 and 4
function getLinks3and4(data) {
  const links = [];
  const col4 = getNodes4Col4(data);
  for (let i = 0; i < col4.length; i++) {
    let newLink = {source: "JMU Athletics", value: data[col4[i].location]["Total"], target: col4[i]["name"]};
    links.push(newLink);
  }
  console.log("col 3 to 4 links: " , links)
  return links;
}

// The links connecting columns 4 and 5
function getLinks4and5(data) {
  const links = [];
  const col4 = getNodes4Col4(data);
  for (let i = 0; i < col4.length; i++) {
    let footballLink = {source: col4[i]["name"], value: data[col4[i].location].Football, target: "footballEnd"};
    let menBasketballLink = {source: col4[i]["name"], value: data[col4[i].location]["Men's Basketball"], target: "men's basketballEnd"};
    let womenBasktballLink = {source: col4[i]["name"], value: data[col4[i].location]["Women's Basketball"], target: "women's basketballEnd"};
    let otherLink = {source: col4[i]["name"], value: data[col4[i].location]["Other sports"], target: "other sportsEnd"};
    let nonSpecific = {source: col4[i]["name"], value: data[col4[i].location]["Non-Program Specific"], target: "non-program specificEnd"};
    links.push(footballLink);
    links.push(menBasketballLink);
    links.push(womenBasktballLink);
    links.push(otherLink);
    links.push(nonSpecific);
  }
  return links;
}

// Diagram 4 link code 
function getLinks4(data) {
  const links = [];
  links.push(...getLinks1and2(data));
  links.push(...getLinks2and3(data));
  links.push(...getLinks3and4(data));
  links.push(...getLinks4and5(data));
  console.log("links in getLinks4: " , links);
  return links;
}

 
// Diagram 4 code 
function forDiagram4(jmuData) {
  const relevantData = jmuData["jmu-athletics"];
  let nodes = getNode4(relevantData);
  let links = getLinks4(relevantData);
  console.log("Nodes in forDiagram4: " , nodes) ;
  console.log("Links in forDiagram4: " , links) ;
  return {'nodes': nodes , 'links': links}
}


async function init() {
  //const data = await d3.json("data/data_sankey.json");
  const jmuData = await d3.json("data/jmu.json");
  const data = forDiagram4(jmuData);
  console.log('data' , data);
  // Applies it to the data. We make a copy of the nodes and links objects
  // so as to avoid mutating the original.
  const { nodes, links } = sankey({
    // const tmp = sankey({
    nodes: data.nodes.map(d => Object.assign({}, d)),
    links: data.links.map(d => Object.assign({}, d))
  });

  // console.log('tmp', tmp);
  console.log('nodes', nodes);
  console.log('links', links);

  // Defines a color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Creates the rects that represent the nodes.
  const rect = svg.append("g")
    .attr("stroke", "#000")
    .selectAll()
    .data(nodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => color(d.category));

  // Adds a title on the nodes.
  rect.append("title")
    .text(d => {
      console.log('d', d);
      return `${d.name}\n${format(d.value)}`
    });

  // Creates the paths that represent the links.
  const link = svg.append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll()
    .data(links)
    .join("g")
    .style("mix-blend-mode", "multiply");

  // Creates a gradient, if necessary, for the source-target color option.
  if (linkColor === "source-target") {
    const gradient = link.append("linearGradient")
      .attr("id", d => (d.uid = `link-${d.index}`))
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", d => d.source.x1)
      .attr("x2", d => d.target.x0);
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", d => color(d.source.category));
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", d => color(d.target.category));
  }

  link.append("path")
    .attr("d", d3Sankey.sankeyLinkHorizontal())
    .attr("stroke", linkColor === "source-target" ? (d) => `url(#${d.uid})`
      : linkColor === "source" ? (d) => color(d.source.category)
        : linkColor === "target" ? (d) => color(d.target.category)
          : linkColor)
    .attr("stroke-width", d => Math.max(1, d.width));

  link.append("title")
    .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  // Adds labels on the nodes.
  svg.append("g")
    .selectAll()
    .data(nodes)
    .join("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.title);

  // Adds labels on the links.
  svg.append("g")
    .selectAll()
    .data(links)
    .join("text")
    .attr("x", d => {
      console.log('linkd', d)
      const midX = (d.source.x1 + d.target.x0) / 2;
      return midX < width / 2 ? midX + 6 : midX - 6
    })
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => {
      console.log('linkd', d);
      return `${d.source.title} → ${d.value} → ${d.target.title}`
    });

  const svgNode = svg.node();
  document.body.appendChild(svgNode);
  return svgNode;
}

init();