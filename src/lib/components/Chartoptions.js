export let options = {
    series: [],
    labels: [],
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
                        label: "Landing Pads",
                        fontFamily: "Inter, sans-serif",
                        formatter: function (w) {
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
                return `${value}%`;
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