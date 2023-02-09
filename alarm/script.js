let timerRef = document.querySelector(".timer-display");
const hourInput = document.getElementById("hourInput");
const hourIncrement = document.querySelector(".hourIncrement");
const hourDecrement = document.querySelector(".hourDecrement");
const minuteIncrement = document.querySelector(".minuteIncrement");
const minuteDecrement = document.querySelector(".minuteDecrement");
const minuteInput = document.getElementById("minuteInput");
const activeAlarms = document.querySelector(".activeAlarms");
const setAlarm = document.getElementById("set");
let alarmsArray = [];
let alarmSound = new Audio("https://dl.dropbox.com/s/i08bkrba2jv8cmf/alarm.mp3?raw=1");

let initialHour = 0,
  initialMinute = 0,
  alarmIndex = 0;

//append zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);

//search for value in object
const searchObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

//Display time
function displayTimer() {
  let date = new Date();
  //current hours,minutes.seconds
  let [hours, minutes, seconds] = [
    appendZero(date.getHours()),
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds()),
  ];

  //display time(with zeroes appended)
  timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;
  //alarm
  alarmsArray.forEach((alarm, index) => {
    if (alarm.isActive) {
      if (
        `${alarm.alarmHour}:${alarm.alarmMinute}` ===
        `${hours}:${minutes}`
      ) {
        alarmSound.play();
        alarmSound.loop = true;
      }
    }
  });
}
const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  }
  return inputValue;
};
//   Update 
hourInput.addEventListener("input", () => {
  let cleanedValue=inputCheck(hourInput.value)
  if(parseInt(cleanedValue)>24){
      hourInput.style.color='red';
      setAlarm.disabled=true;
  }else{
      hourInput.style.color='black';
      setAlarm.disabled=false;
  }
  hourInput.value =cleanedValue;
});
//   Update
minuteInput.addEventListener("input", () => {
  let cleanedValue=inputCheck(minuteInput.value)
  if(parseInt(cleanedValue)>59){
      minuteInput.style.color='red';
      setAlarm.disabled=true;
  }else{
      minuteInput.style.color='black';
      setAlarm.disabled=false;
  }
  minuteInput.value = cleanedValue;
});

//create alarm div
const createAlarm = (alarmObj) => {
  //keys from object (destructure)
  const { id, alarmHour, alarmMinute } = alarmObj;
  //Alarm Div
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `
  <span>
    ${alarmHour} : ${alarmMinute}
  </span>`;
  //checkbox
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);
  //delete Button
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);
  activeAlarms.appendChild(alarmDiv);
};
//set alarm
setAlarm.addEventListener("click", () => {
  alarmIndex += 1;
  //alarmObject (stores alarm details)
  let alarmObj = {};

  alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}`;
  alarmObj.alarmHour = hourInput.value;
  alarmObj.alarmMinute = minuteInput.value;
  alarmObj.isActive = false;

  alarmsArray.push(alarmObj);
  createAlarm(alarmObj);
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
});

//start Alarm
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = true;
  }
};

//stop Alarm
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = false;
    alarmSound.pause();
  }
};

//delete alarm
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    e.target.parentElement.remove();
    alarmsArray.splice(index, 1);
  }
};

window.onload = () => {
  setInterval(displayTimer);
  initialHour = 0;
  initialMinute = 0;
  alarmIndex = 0;
  alarmsArray = [];
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
};