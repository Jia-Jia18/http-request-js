var express = require('express');
var DataLayer = require("./companydata/index.js");
var port = process.env.PORT || 8080;
var bl = require("./businessLayer.js")
var dl = null;

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var result = "";
app.delete('/CompanyServices/company', function(req,res){
    try {
        var company = req.query.company;
        if(bl.checkCompany(company) == false){
            result = {error: "company does not exists!"};
        } else {
            dl = new DataLayer(company);
            dl.deleteCompany(company);
            result = {success:company +"'s information deleted."};
        }
        
     } catch (e) {
        result = {error:"delete company failed!"};
     } 
    res.send(JSON.stringify(result));
});



app.get('/CompanyServices/department', function(req, res) {
    try{
        var company = req.query.company;
        var dept_id = req.query.dept_id;
        dl = new DataLayer(company);

        if(bl.checkIDExist(dept_id) == false){
            result = {error: "Dept_id does not exists!"};
        }
        else{
            var d = dl.getDepartment(company,dept_id);
            result = {
                dept_id:d.getId(),
                company:d.getCompany(),
                dept_name:d.getDeptName(),
                dept_no:d.getDeptNo(),
                location:d.getLocation()
            }
        }
    } catch (e){
        result = {error: "get department failed."};
    } 
    res.send(JSON.stringify(result));
});



app.get('/CompanyServices/departments', function(req, res) {
    try{
        var company = req.query.company;
        dl = new DataLayer(company);

        if(bl.checkCompany(company) == false){
            result = {error: "company does not exists!"};
        }
        else{
            var departments = dl.getAllDepartment(company);
            var list = [];

            for(let d of departments ){    	  
            department = {
                dept_id:d.getId(),
                company:d.getCompany(),
                dept_name:d.getDeptName(),
                dept_no:d.getDeptNo(),
                location:d.getLocation()
            }
            list.push(department)
        }
           result = list;
        }
    } catch (e){
        result = {error: "get all departments failed."};
    } 
    res.send(JSON.stringify(result));
});


app.put('/CompanyServices/department', function(req, res) {
    try{
        var company = req.body.company;
        var dept_id = parseInt(req.body.dept_id);
        var dept_name = req.body.dept_name;
        var dept_no = req.body.dept_no;
        var location = req.body.location;

        dl = new DataLayer(company);
        if(bl.checkDeptNoUnique(dept_no) == false){
            result = {error: "Dept_no is not unique among all companies"};
        }
        else if(bl.checkIDExist(dept_id) == false){
            result = {error: "Dept_id does not exists!"};
        }
        else{
            var d = dl.getDepartment(company,dept_id);
            d.setDeptName(dept_name);
            d.setDeptNo(dept_no);
            d.setLocation(location);
            var update = dl.updateDepartment(d);
            
            result ={
                sucess:
                {
                    dept_id: update.getId(),
                    company: update.getCompany(),
                    dept_name: update.getDeptName(),
                    dept_no: update.getDeptNo(),
                    location: update.getLocation()
                }
            };
        } 
    } catch (e){
        result = {error:"Update department failed."};
    } 
    res.send(JSON.stringify(result));
});



app.post('/CompanyServices/department', function(req, res) {
    try{
        var company = req.body.company;
        var dept_name = req.body.dept_name;
        var location = req.body.location;
        var dept_no = req.body.dept_no;

        dl = new DataLayer(company);

        if(bl.checkDeptNoUnique(dept_no) == false){
            result = {error: "Dept_no is not unique among all companies"};
        }
        else{
            
            var d = new dl.Department(company,dept_name,dept_no,location);
            d = dl.insertDepartment(d);
            result = {
                sucess:
                {
                dept_id:d.getId(),
                company:d.getCompany(),
                dept_name:d.getDeptName(),
                dept_no:d.getDeptNo(),
                location:d.getLocation()
                }
            };
        } 
    }
    catch (e){
        result = {error:"Insert department failed."};
    }
    res.send(JSON.stringify(result));
});

app.delete('/CompanyServices/department', function(req, res) {
    try {
        var company = req.query.company;
        var dept_id = req.query.dept_id;
        dl = new DataLayer(company);
        if(bl.checkIDExist(dept_id) == false){
            result = {error: "Dept_id does not exists!"};
        }
        else {
            dl.deleteDepartment(company,dept_id);
            result = {success:"Department " + dept_id + " from " + company + " is deleted."};
        }
     } 
     catch (e) {
        result = {error:"delete department failed!"};
     }
    res.send(JSON.stringify(result));
});



app.get('/CompanyServices/employee', function(req, res) {
    try{
       var company = req.query.company;
       var emp_id = req.query.emp_id;

       dl = new DataLayer(company);
       if(bl.checkEmpExist(emp_id) == false){
            result = {error: "Emp_id does not exists!"};
       }
       else{
           var employee = dl.getEmployee(emp_id); 
           result = {
               emp_id: employee.getId(),
               emp_name:employee.getEmpName(),
               emp_no:employee.getEmpNo(),
               hire_date:employee.getHireDate(),
               job:employee.getJob(),
               salary:employee.getSalary(),
               dept_id:employee.getDeptId(),
               mng_id:employee.getMngId()
           };
       } 
   } 
   catch (e){
       result = {error: "get employee failed!"};
   }
   res.send(JSON.stringify(result));
});



app.get('/CompanyServices/employees', function(req, res) {
    try{
        var company = req.query.company;
        dl = new DataLayer(company);
        var employees = dl.getAllEmployee(company);
        var list = [];
        for(let e of employees ){    	  
            emp = {
                emp_id:e.getId(),
                emp_name:e.getEmpName(),
                emp_no:e.getEmpNo(),
                hire_date:e.getHireDate(),
                job:e.getJob(),
                salary:e.getSalary(),
                dept_id:e.getDeptId(),
                mng_id:e.getMngId()
            };
            list.push(emp);
        }
        result = list;
    } catch (e){
        result = {error: "failed to get all employees."};
    }
    res.send(JSON.stringify(result));
});

app.post('/CompanyServices/employee', function(req, res) {
    try {
        var company = req.body.company;
        var emp_name = req.body.emp_name;
        var emp_no = req.body.emp_no;
        var hire_date = req.body.hire_date;
        var job = req.body.job;
        var salary = parseFloat(req.body.salary);
        var dept_id = parseInt(req.body.dept_id);
        var mng_id = parseInt(req.body.mng_id);

        if(bl.checkCompany(company) == false){
            result = {error: "company does not exists!"};
        }
        else if(bl.checkIDExist(dept_id) == false){
            //ii.	dept_id must exist as a Department in your company
            result = {error: "Dept_id does not exists!"};
        }
        //iv.	hire_date must be a valid date equal to the current date or earlier (e.g. current date or in the past)
        else if(bl.checkDate(hire_date) == false){
            result = {error: "hire_date must be a valid date equal to the current date or earlier (e.g.current date or in the past)!"};
        }
        //v.	hire_date must be a Monday, Tuesday, Wednesday, Thursday or a Friday. It cannot be Saturday or Sunday.
        else if (bl.checkWeekDay(hire_date) == false){
            result = {error: "hire_date must be a Monday, Tuesday, Wednesday, Thursday or a Friday. It cannot be Saturday or Sunday!"};
        }
        //vi.	emp_no must be unique amongst all employees in the database, including those of other companies.
        else if(bl.checkEmpNoUnique(emp_no) == false){
            result = {error: "emp_no must be unique amongst all employees in the database!"};
        }
        else{
            //iii.	mng_id must be the record id of an existing Employee in your company. Use 0 if the first employee or any other employee that doesn’t have a manager.
            if(bl.checkMngIdExist(mng_id) == false){
                mng_id = 0;
            }

            dl = new DataLayer(company);
            var e = dl.insertEmployee(new dl.Employee(emp_name,emp_no,hire_date,job,salary,dept_id,mng_id));
            result =  {
                sucess:
                {
                    emp_id:e.getId(),
                    emp_name:e.getEmpName(),
                    emp_no:e.getEmpNo(),
                    hire_date:e.getHireDate(),
                    job:e.getJob(),
                    salary:e.getSalary(),
                    dept_id:e.getDeptId(),
                    mng_id:e.getMngId()
                }
            };
        }
    }catch(x){
        result = {error: "insert employee failed!"};
    } 
        res.send(JSON.stringify(result));
    });


app.put('/CompanyServices/employee', function(req, res) {
    try{
        var company = req.body.company;
        var emp_id = parseInt(req.body.emp_id);
        var emp_name = req.body.emp_name;
        var emp_no = req.body.emp_no;
        var hire_date = req.body.hire_date;
        var job = req.body.job;
        var salary = parseFloat(req.body.salary);
        var dept_id = parseInt(req.body.dept_id);
        var mng_id = parseInt(req.body.mng_id);

        if(bl.checkCompany(company) == false){
            result = {error: "company does not exists!"};
        }
        else if(bl.checkIDExist(dept_id) == false){
             //ii.	dept_id must exist as a Department in your company
            result = {error: "Dept_id does not exists!"};
        }
        //iv.	hire_date must be a valid date equal to the current date or earlier (e.g. current date or in the past)
        else if(bl.checkDate(hire_date) == false){
            result = {error: "hire_date must be a valid date equal to the current date or earlier (e.g.current date or in the past)!"};
        }
        //v.	hire_date must be a Monday, Tuesday, Wednesday, Thursday or a Friday. It cannot be Saturday or Sunday.
        else if (bl.checkWeekDay(hire_date) == false){
            result = {error: "hire_date must be a Monday, Tuesday, Wednesday, Thursday or a Friday. It cannot be Saturday or Sunday!"};
        }
        //vi.	emp_no must be unique amongst all employees in the database, including those of other companies.
        else if(bl.checkEmpNoUnique(emp_no) == false){
            result = {error: "emp_no must be unique amongst all employees in the database!"};
        }
        //emp_id must be a valid record id in the database.
        else if(bl.checkEmpExist(emp_id) == false){
            result = {error: "emp_id must be a valid record id in the database!"};
        }
        else{
            if(bl.checkMngIdExist(mng_id) == false){
                mng_id = 0;
            }
            dl = new DataLayer(company);
            var e = dl.getEmployee(emp_id);
            e.setEmpName(emp_name);
            e.setEmpNo(emp_no);
            e.setHireDate(hire_date);
            e.setJob(job);
            e.setSalary(salary);
            e.setDeptId(dept_id);
            e.setMngId(mng_id);
            var update = dl.updateEmployee(e);

            result = {
                sucess:
                {
                    emp_id: update.getId(),
                    emp_name: update.getEmpName(),
                    emp_no: update.getEmpNo(),
                    hire_date: update.getHireDate(),
                    job: update.getJob(),
                    salary: update.getSalary(),
                    dept_id: update.getDeptId(),
                    mng_id: update.getMngId()
                }
            };
        } 
    } 
    catch (x){
        result = {error:"Update employee failed."};
    }
    res.send(JSON.stringify(result));
});


app.delete('/CompanyServices/employee', function(req, res) {
    try {
        var company = req.query.company;
        var emp_id = req.query.emp_id;
        dl = new DataLayer(company);

        if(bl.checkEmpExist(emp_id) == false){
            result = {error:"Emp_id does not exists!"};
        } else{
            var d = dl.deleteEmployee(emp_id);
            if (d <= 0){
                result = {error:"Employee not deleted."};
            } 
            result = {success:"Employee " + emp_id + " deleted."};
            
        }
    } 
    catch (e) {
        result = {error:"delete employee failed."};
    }  
    res.send(JSON.stringify(result));
});


app.get('/CompanyServices/timecard', function(req, res) {
    try{
        var company = req.query.company;
        var timecard_id = req.query.timecard_id;

        dl = new DataLayer(company);
        if(bl.checkTimecardId(timecard_id) == false){
            result = {error: "timecard_id does not exists!"};
        }
        else{
            var t = dl.getTimecard(timecard_id); 
            result = {
                timecard : {
                    timecard_id:t.getId(),
                    start_time:t.getStartTime(),
                    end_time:t.getEndTime(),
                    emp_id:t.getEmpId()
                }
            };
        } 
    } 
    catch (e){
        result = {error: "Get timecard failed!"};
    } 
    res.send(JSON.stringify(result));
});



app.get('/CompanyServices/timecards', function(req, res) {
    try{
        var company = req.query.company;
        var emp_id = req.query.emp_id;
        dl = new DataLayer(company);

        if(bl.checkEmpExist(emp_id) == false){
            result = {error: "emp_id does not exists!"};
        } 
        else{
            var timecards = dl.getAllTimecard(emp_id);
            var list = [];
            for(let t of timecards ){    	  
                var timecard = {
                    timecard_id:t.getId(),
                    start_time:t.getStartTime(),
                    end_time:t.getEndTime(),
                    emp_id:t.getEmpId()
                };
                list.push(timecard);
            }
            result = list;
        }
    }
    catch (e){
        result = {error: "Get all timecard failed!"};
    } 
    res.send(JSON.stringify(result));
});


app.post('/CompanyServices/timecard', function(req, res) {
    try{
        var company = req.body.company;
        var emp_id = req.body.emp_id;
        var start_time = req.body.start_time;
        var end_time = req.body.end_time;

        //emp_id must exist as the record id of an Employee in your company
        if(bl.checkCompany(company) == false){
            result = {error: "company must be your RIT id"};
        }
        //emp_id must exist as the record id of an Employee in the company.
        else if(bl.checkEmpExist(emp_id) == false){
            result = {error: "emp_id does not exists!"};
        }
        //start time equal to the current date or back to the Monday prior to the current date if the current date is not a Monday
        else if(bl.checkDate(start_time) == false){
            result = {error: "Start time must equal to the current date or back to the Monday prior to the current date if the current date is not a Monday!"};
        }
        //end_time must be at least 1 hour greater than the start_time and be on the same day as the start_time.
        else if(bl.checkEndTime(start_time,end_time) == false){
            result = {error: "end_time must be at least 1 hour greater than the start_time and be on the same day as the start_time!"};
        }
        //start_time and end_time must be a Monday, Tuesday, Wednesday,Thursday or a Friday. They cannot be Saturday or Sunday.
        else if(bl.checkWeekDay(start_time) == false || bl.checkWeekDay(end_time) == false ){
            result = {error: "start_time and end_time must be a Monday, Tuesday, Wednesday, Thursday or a Friday. They cannot be Saturday or Sunday"};
        }
        //start_time and end_time must be between the hours (in 24 hour format) of 08:00:00 and 18:00:00 inclusive.
        else if(bl.TimeRange(start_time) == false || bl.TimeRange(end_time) == false ){
            result = {error: "Time must be between the hours (in 24 hour format) of 08:00:00 and 18:00:00 inclusive!"};
        }
        //start_time must not be on the same day as any other start_time for that employee.
        else if(bl.checkTimeFrame(emp_id,start_time) == false){
            result = {error: "start time must not be on the same day as any other start_time for that employee!"};
        }
        else{
            dl = new DataLayer(company);
            var time = new dl.Timecard(start_time,end_time,emp_id);
            var t = dl.insertTimecard(time);
            result = 
            {
                sucess:
                {
                    timecard_id:t.getId(),
                    start_time:t.getStartTime(),
                    end_time:t.getEndTime(),
                    emp_id:t.getEmpId()
                }
            };
        
        }
    } 
    catch (e){
        result = {error:"Insert timecard failed."};
    } 
    res.send(JSON.stringify(result));
});



app.put('/CompanyServices/timecard', function(req, res) {
    try{
        var company = req.body.company;
        var timecard_id = req.body.timecard_id;
        var start_time = req.body.start_time;
        var end_time = req.body.end_time;
        var emp_id = req.body.emp_id;

        //emp_id must exist as the record id of an Employee in your company
        //emp_id must exist as the record id of an Employee in your company
        if(bl.checkCompany(company) == false){
            result = {error: "company must be your RIT id"};
        }
        //emp_id must exist as the record id of an Employee in the company.
        else if(bl.checkEmpExist(emp_id) == false){
            result = {error: "emp_id does not exists!"};
        }
        //start time equal to the current date or back to the Monday prior to the current date if the current date is not a Monday
        else if(bl.checkDate(start_time) == false){
            result = {error: "Start time must equal to the current date or back to the Monday prior to the current date if the current date is not a Monday!"};
        }
        //end_time must be at least 1 hour greater than the start_time and be on the same day as the start_time.
        else if(bl.checkEndTime(start_time,end_time) == false){
            result = {error: "end_time must be at least 1 hour greater than the start_time and be on the same day as the start_time!"};
        }
        //start_time and end_time must be a Monday, Tuesday, Wednesday,Thursday or a Friday. They cannot be Saturday or Sunday.
        else if(bl.checkWeekDay(start_time) == false || bl.checkWeekDay(end_time) == false ){
            result = {error: "start_time and end_time must be a Monday, Tuesday, Wednesday, Thursday or a Friday. They cannot be Saturday or Sunday"};
        }
        //start_time and end_time must be between the hours (in 24 hour format) of 08:00:00 and 18:00:00 inclusive.
        else if(bl.TimeRange(start_time) == false || bl.TimeRange(end_time) == false ){
            result = {error: "Time must be between the hours (in 24 hour format) of 08:00:00 and 18:00:00 inclusive!"};
        }
        //start_time must not be on the same day as any other start_time for that employee.
        else if(bl.checkTimeFrame(emp_id,start_time) == false){
            result = {error: "start time must not be on the same day as any other start_time for that employee!"};
        }
        else if(bl.checkTimecardId(timecard_id) == false){
            result = {error: "timecard_id does not exists!" };
        }
        else {
            dl = new DataLayer(company);
            var time = dl.getTimecard(timecard_id);
            time.setStartTime(start_time);
            time.setEndTime(end_time);
            time.setEmpId(emp_id);
   	        var t = dl.updateTimecard(time);   
            result = {
                sucess:
                {
                    timecard_id:t.getId(),
                    start_time:t.getStartTime(),
                    end_time:t.getEndTime(),
                    emp_id:t.getEmpId()
                }
            };
        } 
    } 
    catch (e){
        result = {error:"Update timecard failed!"};
    } 
    res.send(JSON.stringify(result));
});

app.delete('/CompanyServices/timecard', function(req, res) {
    try {
        var company = req.query.company;
        var timecard_id = req.query.timecard_id;
        dl = new DataLayer(company);
        if(bl.checkTimecardId(timecard_id) == false){
            result = {error:"timecard_id does not exists!"};
        }
        else{
            dl.deleteTimecard(timecard_id);
            result = {success:"Timecard " + timecard_id + " deleted."};
        }
    } 
    catch (e) {
        result = {error:"delete timecard failed!"};
    }
    res.send(JSON.stringify(result));
});



var server = app.listen(8080,function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server running at http://%s:%s",host,port);
});