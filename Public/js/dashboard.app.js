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
    fetchTasks: function() {
      fetch('https://raw.githubusercontent.com/tag/iu-msis/dev/public/p1-tasks.json')
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
      fetch('https://raw.githubusercontent.com/tag/iu-msis/dev/public/project1.json')
      .then( response => response.json() )
      .then( json => {dashboardApp.project = json} )
      .catch( err => {
        console.log('PROJECT FETCH ERROR:');
        console.log(err);
      })
    },
    gotoTask(tid) {
      console.log(tid);
      window.location = 'taskDetail.html?taskId='+tid;
    }
  },
  created: function() {
    this.fetchTasks();
  }


});
