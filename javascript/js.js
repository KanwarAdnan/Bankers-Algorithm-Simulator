// Code By Kanwar Adnan
var id = 0;

class Process {
   constructor(name, maxMatrix, allocatedMatrix) {
      this.name = name;
      this.maxMatrix = maxMatrix;
      this.allocatedMatrix = allocatedMatrix;
      this.needMatrix = this.maxMatrix.map((val, i) => val - this.allocatedMatrix[i]);
   }
}


class Resources {
   constructor(resourcesMatrix) {
      this.resourcesMatrix = resourcesMatrix;
   }
}

class BankersAlgorithm {
   static getSaveState(processes, resources) {
      let readyQueue = [...processes];
      let waitingQueue = [];
      let finishedQueue = [];
      while (true) {
         if (readyQueue.length === 0 && waitingQueue.length === 0) {
            break;
         } else if (readyQueue.length === 0 && waitingQueue.length !== 0) {
            readyQueue = [...waitingQueue];
            waitingQueue = [];
         } else {
            let process = readyQueue[0];
            let canExecute = true;
            for (let i = 0; i < process.needMatrix.length; i++) {
               if (process.needMatrix[i] > resources.resourcesMatrix[i]) {
                  canExecute = false;
                  break;
               }
            }
            if (canExecute) {
               resources.resourcesMatrix = resources.resourcesMatrix.map((val, i) => val + process.allocatedMatrix[i]);
               process.allocatedMatrix = Array(process.allocatedMatrix.length).fill(0);
               finishedQueue.push(process);
               readyQueue.shift();
               waitingQueue = waitingQueue.filter(p => p !== process);
            } else {
               waitingQueue.push(process);
               readyQueue.shift();
            }
         }
      }
      finishedQueue = BankersAlgorithm.getFinishedProcessNames(finishedQueue);
      return finishedQueue;
   }
   static getFinishedProcessNames(finishedQueue) {
      return finishedQueue.map(process => process.name);
   }
}

function add_process() {
   let div_process = document.getElementById('div_processes');
   let new_div = document.createElement('div');
   new_div.innerHTML = `
<div class="card">
  <div class="card-header bg-success text-white font-weight-bold">Process No ${id}</div>
  <div class="card-body">
    <table class="table table-bordered table-responsive-sm">
      <tbody>
        <tr>
          <td class="font-weight-bold">Process Name:</td>
          <td colspan="3"><input type="text" id="process-name-input" placeholder="<name>" class="form-control" value="P${id}"></td>
        </tr>

        <tr>
          <td class="font-weight-bold">Max Matrix:</td>
          <td class="text-center">A<input type="number" id="Max-A-input" placeholder="<number>" class="form-control"></td>
          <td class="text-center">B<input type="number" id="Max-B-time-input" placeholder="<number>" class="form-control"></td>
          <td class="text-center">C<input type="number" id="Max-C-time-input" placeholder="<number>" class="form-control"></td>
        </tr>

        <tr>
          <td class="font-weight-bold">Allocated Matrix:</td>
          <td class="text-center">A<input type="number" id="Alloc-A-input" placeholder="<number>" class="form-control"></td>
          <td class="text-center">B<input type="number" id="Alloc-B-time-input" placeholder="<number>" class="form-control"></td>
          <td class="text-center">C<input type="number" id="Alloc-C-time-input" placeholder="<number>" class="form-control"></td>
        </tr>

      </tbody>
    </table>
  </div>
</div>
   `
   new_div.id = "div_process"
   div_process.appendChild(new_div);
   id++;
}

function add_resource() {
   let div_resources = document.getElementById('div_resources');
   let new_div = document.createElement('div');
   new_div.innerHTML = `
<div class="card">
  <div class="card-header bg-success text-white font-weight-bold">Resources</div>
  <div class="card-body">
    <table class="table table-bordered table-responsive-sm">
      <tbody>
        <tr>
          <td class="font-weight-bold">Resource Name:</td>
          <td colspan="3" ><input type="text" id="resource-name-input" placeholder="<name>" class="form-control" value="R1"></td>
        </tr>

        <tr>
          <td class="font-weight-bold">Available Matrix:</td>
          <td class="text-center">A<input type="number" id="Res-A-input" placeholder="<number>" class="form-control"></td>
          <td class="text-center">B<input type="number" id="Res-B-time-input" placeholder="<number>" class="form-control"></td>
          <td class="text-center">C<input type="number" id="Res-C-time-input" placeholder="<number>" class="form-control"></td>
        </tr>

      </tbody>
    </table>
  </div>
</div>
   `
   new_div.id = "div_avail";
   document.getElementById("result_heading").style.visibility = "hidden";
   div_resources.appendChild(new_div);
}


function create_resource() {
   let inputs = document.getElementsByClassName("form-control");
   let resourceMatrix = [parseInt(inputs[1].value), parseInt(inputs[2].value), parseInt(inputs[3].value)];
   let resources = new Resources(resourceMatrix);
   return resources;
}

function validate_fields() {
   let inputs = document.getElementsByTagName("input");
   for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value == "") {
         alert("Please enter value in the field");
         inputs[i].focus();
         return false;
      }
   }
   return true;
}

function get_processes() {
   let processDivs = document.getElementsByClassName("card");
   let processList = [];
   for (let i = 1; i < processDivs.length; i++) {
      let inputs = processDivs[i].getElementsByTagName("input");
      let name = inputs[0].value;
      let maxMatrix = [parseInt(inputs[1].value), parseInt(inputs[2].value), parseInt(inputs[3].value)];
      let allocatedMatrix = [parseInt(inputs[4].value), parseInt(inputs[5].value), parseInt(inputs[6].value)];
      let process = new Process(name, maxMatrix, allocatedMatrix);
      processList.push(process);
   }
   console.log(processList);
   return processList;
}

function clear_process() {
   document.getElementById("result_heading").style.visibility = "hidden";
   document.getElementById("result-list").style.visibility = "hidden";
   const result = document.getElementById("result-list");
   result.innerHTML = "";
   const div_processes = document.getElementById("div_processes");
   div_processes.innerHTML = "";
   id = 0;
   add_process();
   let inputs = document.getElementsByClassName("form-control");
   inputs[1].value = "";
   inputs[2].value = "";
   inputs[3].value = "";
}


function del_process() {
   div_process = document.querySelectorAll('#div_process');
   if (div_process.length > 1) {
      div_process = div_process[div_process.length - 1];
      div_process.remove();
      id--;
      return;
   }
   alert('Atleast one process is required to compute the results');
}

function del_result() {
   const result = document.getElementById("result-list");
   result.innerHTML = "";
}

function calculate() {
   if (validate_fields() == true) {
      del_result();
      const processes = get_processes();
      const resource = create_resource();
      const save_state = BankersAlgorithm.getSaveState(processes, resource);

      let resultList = document.getElementById("result-list");
      for (let processName of save_state) {
         let listItem = document.createElement("li");
         listItem.classList.add("list-group-item");
         listItem.innerHTML = processName;
         resultList.appendChild(listItem);
      }
      document.getElementById("result-list").style.visibility = "visible";
      document.getElementById("result_heading").style.visibility = "visible";
   }
}