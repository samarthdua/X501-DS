var dashboardApp = new Vue({
  el: '#dashboard',
  data: {
    project: {
          "name" : '',
          "short_description": '',
          "start_date" : '',
          "target_date" : '',
          "budget" : '',
          "spent" : '',
          projected_spend: '',
          weekly_effort_target: ''
        },
  tasks: [
      {
        "id": 1,
        "title": "",
        "type" : "",
        "size" : "",
        "team" : "",
        "status": "",
        "start_date": "",
        "close_date": null,
        "hours_worked":null,
        "perc_complete": null,
        "current_sprint" : null
      }
    ]
  },
  computed: {
    days_left: function() {
      //this.target_date
      return 31;
    },
    pretty_target_date: function () {
      return this.pretty_date(this.target_date);
    }
  },
  methods: {
    pretty_date: function(d) {
      // do magic
      return d;
    },
    log: function(message)  {
      alert(message);
    },
    pretty_currency: function (val) {
      if (val < 1e3) {
        return '$ ' + val;
      }

      if (val < 1e6) {
        return '$ ' + (val/1e3).toFixed(1) + ' k';
      }

      return '$ ' + (val/1e6).toFixed(1) + ' M';
    },
    completeClass: function(task) {
      if (task.perc_complete == 100 ) {
        return 'alert-success';
      }
      if (task.current_sprint && task.hours_worked == 0 ) {
        return 'alert-warning';
      }
    },
    fetchTasks () {
      fetch('https://raw.githubusercontent.com/tag/iu-msis/dev/app/data/p1-tasks.json')
      .then( response => response.json())
      .then( json => {
        this.tasks = json;
        console.log('FETCH returned:');
        console.log(json);
      })
      .catch( function(err) {
        console.log('FETCH error:');
        console.log(err);
      });
    },
    fetchProject () {
      fetch('https://raw.githubusercontent.com/tag/iu-msis/dev/app/data/project1.json')
      .then( response => response.json() )
      .then( json => {
        dashboardApp.project = json;

      })
      .catch( err => {
        console.log('PROJECT FETCH ERROR:');
        console.log(err);
      })
    },
    fetchProjectWork (pid) {
      fetch('api/workHours?projectId='+pid)
      .then( response => response.json() )
      .then( json => {
        dashboardApp.workHours = json;
        this.formatWorkHoursData();
        this.buildEffortChart();
      } )
      .catch( err => {
        console.log('PROJECT FETCH ERROR:');
        console.log(err);
      })
    },
    formatWorkHours() {
      this.workHours.forEach(
        function(entry, index, arr) {
          entry.hours = Number(entry.hours);
          entry.runningTotalHours = entry.hours + (index > 0 ? arr[index-1].runningTotalHours : 0);
          entry.date = Date.parse(entry.date);
        }
      );
      console.log(this.workHours);
    },
    buildEffortChart() {
      Highcharts.chart('effortChart', {
            title: {
                text: 'Cumulative Project Effort'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Hours'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: 'Effort (hrs)',
                // Data needs [ [date, num], [date2, num2 ], ... ]
                data: this.workHours.map( row => [row.date, row.runningTotalHours] )
            }]
        });
    },
    gotoTask(tid) {
      console.log(tid);
      window.location = 'taskDetail.html?taskId='+tid;
    }
  },
  created: function() {
    const url = new URL(window.location.href);
    const projectId = url.searchParams.get('projectId') || 0;

    if (!projectId) {
      console.error('Project Id not defined in URL parameters.')
    }

    this.project.id = projectId;
    this.fetchProject(projectId);
    this.fetchTasks(projectId);
    this.fetchProjectWork(projectId);
  }


});
