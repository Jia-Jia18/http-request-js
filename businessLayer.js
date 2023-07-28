var moment = require("moment");
var DataLayer = require("./companydata/index.js");
var company = "jc1026";
var dl = new DataLayer(company);


module.exports = {
    checkIDExist: function(dept_id) {
        //check if dept_id exists
        var departments = dl.getAllDepartment(company);
        var list = [];
        for(let d of departments ){    	
            list.push(d.getId());
        }
        if(!list.includes(parseInt(dept_id)))
            return false;
        return true;
    },

    checkEmpExist: function (emp_id) {
    
        //check if emp_id exists
        var employee = dl.getAllEmployee(company);
        var list = [];
        for(let e of employee ){    	
            list.push(e.getId());
        }
        if(!list.includes(parseInt(emp_id)))
            return false;
        return true;
    },

    checkCompany: function(companyName ){
        if(companyName == ("jc1026")){
            return true;
        } 
        return false;
    },

    checkDeptNoUnique: function (dept_no) {
        var departments = dl.getAllDepartment(company);
        var list = [];
        for(let d of departments ){  
            list.push(d.getDeptNo());
            if(list.includes(dept_no)){
                return false;
            }
        }
        return true; 
      },

     checkMngIdExist: function(mng_id) {
        var employee = dl.getAllEmployee(company);
        var list = [];
        for(let e of employee ){    	
            list.push(e.getMngId());
        }
        if(!list.includes(parseInt(mng_id))){
            return false;
        } 
        return true;
      },

    checkDate: function(date) {
        var d = moment(date);
        var today = moment();
        if(d.isSameOrBefore(today)){
            return true;
        } 
        else {
            return false;
        }

    },

    checkWeekDay: function(date) {
        var dow = moment(date);
        if(dow.day() != 6 && dow.day() != 0){
            return true;
        }
        else {
            return false;
        }
    },

    checkEmpNoUnique: function(emp_no) {
        var employees = dl.getAllEmployee(company);
        var list = [];
        for(let e of employees ){  
            list.push(e.getEmpNo());
        }
        if(list.includes(emp_no)){
            return false;
        }
        return true;
      },

      checkTimecardId: function (timecard_id){
        var timecards = dl.getTimecard(timecard_id); 
        if(timecards == null){
            return false;
        }
        return true;
    },


    checkEndTime: function (st, et){
        var start = moment(st);
        var end = moment(et);
        //one hour greater than start time
        if(start.isBefore(end , 'hour') && start.isSame(end , 'day')){
            return true;
        } 
        else {
            return false;
        }
    },

    TimeRange: function(time){
        var date = moment(time);

        if(date.hour() >= 8 && date.hour() < 18){
            return true;
        } 
        else if(date.hour() == 18 && date.minute() == 0){
            return true;
        }
        else {
            return false;
        }
    },

    checkTimeFrame: function(emp_id, st){
        var date = moment(st);
        var timecards = dl.getAllTimecard(emp_id);
        for(let t of timecards){
            var d = moment(t.getStartTime());
            if(t.getEmpId() == emp_id && date.isSame(d,'day'))
                return false;
            return true;  
        }
    }

}

