let dynamicLabel;

export function getChartOptions(data, label) {

    dynamicLabel = data.length === 1 ? "Landing Pad" : "Landing Pads"
    return {
        series: data.length > 1 ? data : [100],
        labels: label,
        colors: data.length === 1 ? ["#d3d3d3"] : [],
        chart: {
            height: 222,
            width: "100%",
            type: "donut",
        },
        stroke: {
            colors: ["transparent"],
            lineCap: "",
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontFamily: "Inter, sans-serif",
                            offsetY: 20,
                        },
                        total: {
                            showAlways: true,
                            show: true,
                            label: dynamicLabel,
                            fontFamily: "Inter, sans-serif",
                            formatter: function (w) {
                                console.log(w.globals.seriesTotals)
                                return w.globals.seriesTotals.length;

                            },
                        },
                        value: {
                            show: true,
                            fontFamily: "Inter, sans-serif",
                            offsetY: -20,
                            formatter: function (value) {
                                return value;
                            },
                        },
                    },
                    size: "80%",
                },
            },
        },
        grid: {
            padding: {
                top: -2,
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    if (value === 100) {
                        return "0%"
                    } else {
                        return `${value}%`;
                    }

                },
            },
        },
        xaxis: {
            labels: {
                formatter: function (value) {
                    return `${value}%`;
                },
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
    };
}