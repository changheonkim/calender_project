<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
           <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            <span class="mx-5 d-inline-block">{{focus | moment('YYYY MMMM')}}</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <template>
          <div class="text-center">
          <router-link to="/about">
          <v-btn
              rounded
              color="primary"
              dark
              @click="open({ date:focus })"
            >
              일정 추가
            </v-btn>
          </router-link>
          </div>
        </template>
                  <template>
          <div class="text-center">
          <router-link to="/category">
          <v-btn
              rounded
              color="primary"
              dark
            >
              기계 분류
            </v-btn>
          </router-link>
          </div>
        </template>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :focus="focus"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:date="open"
          @click:event="showEvent"
          @mousedown:event="startDrag"
          @mousedown:time="startTime"
          @mousemove:time="mouseMove"
          @mouseup:time="endDrag"
        >          
        </v-calendar>
          <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
            <router-link to="/edit">
              <v-btn icon>
                <v-icon 
                @click="edit(selectedEvent)">mdi-pencil</v-icon>
              </v-btn>
              </router-link>          
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                  rounded
                  color="primary"
                  dark
                  @click="deleteEvent(selectedEvent)"
                >
                  Delete
                </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.content"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { defineCustomElement } from '@vue/runtime-dom';
import moment from 'moment';
  
   export default {
    name: 'HelloWorld',
    data: () => ({
      moment:moment,
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day:'Day',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      dragEvent: null,
      dragStart: null,
    }),
    methods: {
      open(date) {
          this.$store.commit('OPEN_CALENDAR_DIALOG', date);
      },
      edit(event) {
          this.$store.commit('EDIT_CALENDAR_DIALOG', event);
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      startDrag ({ event, timed }) {
        if (event && timed) {
          this.dragEvent = event
          this.dragTime = null
        }
      },
      startTime ( tms ) {
        const mouse = this.toTime(tms)
        if (this.dragEvent && this.dragTime === null) {
          const start = this.makeForm(this.dragEvent.start)
          this.dragTime = mouse - start
        }
      },
      mouseMove ( tms ) {
        const mouse = this.toTime(tms)
        if (this.dragEvent && this.dragTime !== null) {
          const start = this.makeForm(this.dragEvent.start)
          const end = this.makeForm(this.dragEvent.end)
          const duration = end - start
          const newStartTime = mouse - this.dragTime
          const newStart = this.roundTime(newStartTime)
          const newEnd = newStart + duration

          var date_S = new Date(newStart)
          var date_E = new Date(newEnd)
          const s = this.returnFrom(date_S)
          const e = this.returnFrom(date_E)

          this.dragEvent.start =  s
          this.dragEvent.end = e
          this.$store.commit('EDIT_EVENT_2', this.dragEvent);
        }
      },
      returnFrom(date){
        return date.getFullYear()+ "-" + (date.getMonth()+1)+ "-" + date.getDate() + " " + date.getHours()+":"+date.getMinutes()
      },
      makeForm(start){
        if(typeof(start) === 'string'){
          var [year, month, temp] = start.split('-')
          var [day, temp_1] = temp.split(' ')
          var[ hour, minute ] = temp_1.split(':')
          return new Date(year, month - 1, day, hour, minute).getTime()
        }
        else return start
      },
      endDrag () {
        this.dragTime = null
        this.dragEvent = null
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      roundTime (time, down = true) {
        const roundTo = 15 // minutes
        const roundDownTime = roundTo * 60 * 1000

        return down
          ? time - time % roundDownTime
          : time + (roundDownTime - (time % roundDownTime))
      },
      toTime (tms) {
        return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
      },
      deleteEvent( event ) {
        this.$store.commit('DELETE_EVENT', event);
      },
    },
        computed: {
        events() {
            return this.$store.state.calendar_data.events;
            }
        },
        categories() {
            return this.$store.state.calendar_data.categories; 
        },
        created() {
            this.focus = this.$moment().format('YYYY-MM-DD');
        },
  }
</script>
