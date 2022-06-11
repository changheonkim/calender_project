import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const calendar_data = {
  state: {
    event: initEvent(),
    events: [],
    categories: ['a', 'b'],
  },
  mutations: {
    OPEN_CALENDAR_DIALOG(state, payload) {
      state.event.title = "";
      state.event.content = "";
      state.event.startDate = payload.date;
      state.event.startTime = "";
      state.event.endDate = "";
      state.event.endTime = "";
      state.event.category = "";
    },
    EDIT_CALENDAR_DIALOG(state, edit_event) {
      state.event.id = edit_event.id;
      state.event.title = edit_event.name;
      state.event.content = edit_event.content;
    },
    EDIT_EVENT(state, editEvent) {
      const editedEvent = makeEvent(editEvent);
      const id = editEvent.id;
      for(let i = 0; i < state.events.length; i++) {
        if(state.events[i].id === id){
          editedEvent.id = id;
          state.events[i] = editedEvent;
        }
      }
    },
    EDIT_EVENT_2(state, editEvent) {
      const id = editEvent.id;
      for(let i = 0; i < state.events.length; i++) {
        if(state.events[i].id === id){
          state.events[i] = editEvent;
        }
      }
    },
    ADD_EVENT(state, getEvent) {
      const addedEvent = makeEvent(getEvent);
      state.events.push(addedEvent);
      state.event = initEvent();
    },
    DELETE_EVENT( state, event ){ 
      for(let i = 0; i < state.events.length; i++) {
        if(state.events[i].id === event.id)  {
          state.events.splice(i, 1);
          i--;
        }
      }
    },
  },
  actions: {
  },
  modules: {
  }
}

const getTime = (time) => {
  return time === null ? '' : ` ${time}`;
};
var i = 0;
function makeEvent(event) {
  return {
    id: i++,
    name: event.title,
    content: event.content,
    start: event.startDate + getTime(event.startTime),
    end: event.endDate + getTime(event.endTime),
    color: event.colors[Math.floor(Math.random() * 6)],
    category: 'a',
    }
  }
  function initEvent() {
    return {
        id: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        content: '',
        title: '',
        category: '',
        colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    }
  }

export default calendar_data