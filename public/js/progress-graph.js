$(".panel.set-panel").each(function() {
  var $this = $(this);
  
  $this.find("a.toggle-graph").click(function() {
    $this.find("div.progress-graph").toggle();
    var toggleGraphChevron = $this.find(".toggle-graph-chevron");
    if (toggleGraphChevron.hasClass("glyphicon-chevron-right")) {
      toggleGraphChevron.removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-down");
    } else {
      toggleGraphChevron.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-right");
    }
  });
  
  var progress = $this.data("progress");
  
  var data = [[], [], [], [], [], []];
  progress.forEach(function(item) {
    for (var i = 0; i <= 5; i++) {
      data[i].push({
        x: item.date,
        y: item.qualities[i]
      }); 
    }
  });
  
  var context = $this.find("canvas.progress-graph-canvas");
  var chart = new Chart(context, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Complete blackout",
          data: data[0],
          backgroundColor: "#d9534f",
          borderColor:     "#d9534f"
        },
        {
          label: "Incorrect, but you remembered the correct answer",
          data: data[1],
          backgroundColor: "#f0ad4e",
          borderColor:     "#f0ad4e"
        },
        {
          label: "Incorrect, but you remembered the correct answer easily",
          data: data[2],
          backgroundColor: "#f0f04e",
          borderColor:     "#f0f04e"
        },
        {
          label: "Correct, but it was difficult to remember",
          data: data[3],
          backgroundColor: "#337ab7",
          borderColor:     "#337ab7"
        },
        {
          label: "Correct, but some with hesitation",
          data: data[4],
          backgroundColor: "#5bc0de",
          borderColor:     "#5bc0de"
        },
        {
          label: "Perfect!",
          data: data[5],
          backgroundColor: "#5cb85c",
          borderColor:     "#5cb85c"
        }
      ]
    },
    options: {
      scales: {
        xAxes: [
          {
            type: "time",
            ticks: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              min: 0,
              max: progress[0].total
            },
            stacked: true,
          }
        ]
      }
    }
  });
});
