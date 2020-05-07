
      
        
        let margin = {
            top: 100,
            left: 60,
            bottom: 30,
            right: 20
        }
        
        const height = 630 - margin.left - margin.right
        const width = 920 - margin.top - margin.bottom
        
        const visHolder = d3.select('.container')
        let svgContainer = visHolder.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "graph")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        var div = visHolder.append('div')
                                .attr('class', 'tooltip')
                                .attr('id', 'tooltip')
                                .style('opacity', 0)
        
        var color = d3.scaleOrdinal(d3.schemeCategory10);                              
        //Format for Time 
        
        var timeFormat = d3.timeFormat("%M:%S")
        
        var x = d3.scaleLinear().range([0, width])
        var y = d3.scaleTime().range([0, height])
        
        var xAxis = d3.axisBottom(x).tickFormat(d3.format('d'));
        
        var yAxis = d3.axisLeft(y).tickFormat(timeFormat)
        


d3.json('data.json',(error, data)=>{
        if(error) throw error;
        data.forEach(d=> {
            d.Place = +d.Place //Converts "10" --> 10
            var parsedTime = d.Time.split(':');
            d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]); //(year, mon, day, min, sec, millisecond)
        });
        //Domain
        var min = d3.min(data, d=> d.Year - 1)
        var max= d3.max(data, d=> d.Year + 1)
        //extent(array) returns the smallest & the biggest number from the provided array & returns an array
        var yExtent = d3.extent(data, d=> d.Time)
        
        function openLink(i){
            let windowOpen = window.open(i.URL, '_blank')
            windowOpen.focus();
        }

        x.domain([min, max]);
        y.domain(yExtent)

        //Axis
        //X-axis
        svgContainer.append('g')
                    .attr('class', 'x-axis')
                    .attr('id', 'x-axis')
                    .attr('transform', `translate(0, ${height})`)
                    .call(xAxis)
                    .append('text')
                    .attr('class', 'x-axis-label')
                    .attr('x', width)
                    .attr('y', -6)
                    .style('text-anchor', 'end')
                    .text('Year')
        svgContainer.append('g')
                    .attr('class', 'y-axis')
                    .attr('id', 'y-axis')
                    .call(yAxis)
                    .append('text')
                    .attr('class', 'label')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', 6)
                    .attr('dy', '.71em')
                    .style('text-anchor', 'end')
                    .text('Best Time (minutes');
        //endsAxis
        svgContainer.append('text')
                    .attr('class', 'axes-y-title')
                    .attr('transform', 'rotate(-90)')
                    .attr('x', -160)
                    .attr('y', -44)      
                    .style('font-size', 18)
                    .text('Time in minutes')          
        

        //Dots for each data

        svgContainer.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 6)
        .attr('cx', d=> x(d.Year))
        .attr('cy', d=> y(d.Time))
        .style('fill', d=>color(d.Doping!==""))
        .attr('data-yvalue', d=>d.Time.toISOString())
        .attr('data-xvalue', d=>d.Year)
        .on('mouseover', d=>{
            div.transition()
            .duration(300)
            .style('opacity', 1);
            div.attr('data-year', d.Year);
            div.html(`${d.Name}: ${d.Nationality}<br/>Year: ${d.Year}, Time: ${timeFormat(d.Time)}`+(d.Doping?'<br/><br/>' + d.Doping : ''))
                .style('position', 'absolute')
                .style('left', d3.event.pageX+'px')
                .style('top', d3.event.pageY - 28 +'px')
        })
        .on('mouseout', d=>div.transition().duration(300).style('opacity', 0))
        .on('click', d=>window.open(d.URL, '_blank').focus())

          //title
            svgContainer
            .append("text")
            .attr("id", "title")
            .attr("x", width / 2)
            .attr("y", 0 - margin.top / 2)
            .attr("text-anchor", "middle")
            .text("Doping in Professional Bicycle Racing");

            //subtitle
            svgContainer
            .append("text")
            .attr('class', 'subtitle')
            .attr("x", width / 2)
            .attr("y", 0 - margin.top / 2 + 25)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("35 Fastest times up Alpe d'Huez");


        //Legend
        var legendContainer = svgContainer.append('g').attr('id', 'legend')

        var legend = legendContainer
                      .selectAll("#legend")
                      .data(color.domain())
                      .enter()
                      .append('g')
                      .attr('class', 'legend-label')
                      .attr('transform', (d, i)=>{
                          return `translate(0, ${height/2-i*20})`;
                      })


                legend.append('rect')
                       .attr('x', width -18 - 144)
                       .attr('y', 18)
                       .attr('width', 18)
                       .attr('height', 18)
                       .style('fill', color);


                legend.append('text')
                       .attr('x', width - 135)
                       .attr('y', 27)
                       .attr('dy', '.35em')//Font-size
                       .style('text-anchore', 'center')
                       .text(d=>{
                          return d?"Riders with doping allegations":'No doping allegations'
                       })

})

