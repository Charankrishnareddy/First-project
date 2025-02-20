var app = angular.module('taskApp', []);

app.controller('TaskController', function ($scope) {
  
    $scope.newTask = {
        employeeId: '',
        deadline: '',
        assignDate: new Date().toISOString().slice(0, 10) 
    };

    
    const firebaseConfig = {
        apiKey: "AIzaSyDNosm9KxC2r1pezkDdFNkMigGRs_PWu8o",
        authDomain: "task-c8d92.firebaseapp.com",
        databaseURL: "https://task-c8d92-default-rtdb.firebaseio.com/", 
        projectId: "task-c8d92",
        storageBucket: "task-c8d92.appspot.com",
        messagingSenderId: "531090558977",
        appId: "1:531090558977:web:d30f8d0167dbaa2b37f000",
        measurementId: "G-VHRNXCMND5"
    };

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database(); 

    $scope.tasks = [];

    function fetchTasks() {
        database.ref('tasks').on('value', (snapshot) => {
            const data = snapshot.val();
            $scope.tasks = data ? Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })) : [];
            $scope.$apply(); 
        });
    }

    fetchTasks();

    // Add Task
    $scope.addTask = function () {
        if ($scope.newTask.title && $scope.newTask.description && $scope.newTask.employeeId && $scope.newTask.deadline && $scope.newTask.assignDate) {
            const newTaskRef = database.ref('tasks').push();
            newTaskRef.set({
                title: $scope.newTask.title,
                description: $scope.newTask.description,
                employeeId: $scope.newTask.employeeId,
                deadline: $scope.newTask.deadline,
                assignDate: $scope.newTask.assignDate
            }).then(() => {
                console.log("Task added successfully!");
                $scope.newTask = {
                    employeeId: '',
                    deadline: '',
                    assignDate: new Date().toISOString().slice(0, 10)
                }; 
                $scope.$apply();
            }).catch(error => {
                console.error("Error adding task:", error);
            });
        } else {
            console.error("All fields are required!");
        }
    };


    $scope.editTask = function (task) {
        task.editing = true;
    };

    
    $scope.updateTask = function (task) {
        const taskRef = database.ref(`tasks/${task.id}`);
        taskRef.update({
            title: task.title,
            description: task.description,
            employeeId: task.employeeId,
            deadline: task.deadline,
            assignDate: task.assignDate
        }).then(() => {
            task.editing = false;
            $scope.$apply();
        }).catch(error => {
            console.error("Error updating task:", error);
        });
    };

 
    $scope.deleteTask = function (taskId) {
        const taskRef = database.ref(`tasks/${taskId}`);
        taskRef.remove().then(() => {
            console.log("Task deleted successfully!");
        }).catch(error => {
            console.error("Error deleting task:", error);
        });
    };
});