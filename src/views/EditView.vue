<template>
      <v-card>
            <v-card-title>
                <h3>일정 편집</h3>
                <v-spacer/>
            </v-card-title>
            <v-card-text>

                <v-form class="px-3" ref="form">
                    <v-text-field label="일정" prepend-icon="mdi-folder-marker"
                                  v-model="event.title"></v-text-field>
                    <v-textarea label="상세설명" prepend-icon="mdi-pencil"
                                v-model="event.content"></v-textarea>
                    <v-row>
                        <v-col class="pb-0" cols="6">
                            <v-menu>
                                <template v-slot:activator="{on}">

                                    <v-text-field :value="event.startDate"
                                                  label="시작일"
                                                  prepend-icon="mdi-calendar-month"
                                                  readonly-slot="activator"
                                                  v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="event.startDate"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col class="pb-0" cols="6">
                            <v-menu
                                    :close-on-content-click="false"
                                    offset-y
                                    v-model="startTimer"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                            :value="event.startTime"
                                            label="시작 시간"
                                            prepend-icon="mdi-timer"
                                            readonly
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-time-picker
                                        v-if="startTimer"
                                        v-model="event.startTime"
                                >
                                    <v-btn @click="selectTime"
                                           class="mx-auto"
                                    >선택
                                    </v-btn>
                                </v-time-picker>
                            </v-menu>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col class="pt-0" cols="6">
                            <v-menu>
                                <template v-slot:activator="{on}">

                                    <v-text-field :value="event.endDate"
                                                  label="종료일"
                                                  prepend-icon="mdi-calendar-month"
                                                  readonly-slot="activator"
                                                  v-on="on"></v-text-field>
                                </template>
                                <v-date-picker :allowed-dates="allowedDates"
                                               v-model="event.endDate"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col class="pt-0" cols="6">
                            <v-menu
                                    :close-on-content-click="false"
                                    offset-y
                                    v-model="endTimer"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                            :value="event.endTime"
                                            label="종료 시간"
                                            prepend-icon="mdi-timer"
                                            readonly
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-time-picker
                                        v-if="endTimer"
                                        v-model="event.endTime"
                                >
                                    <v-btn @click="selectTime"
                                           class="mx-auto"
                                    >선택
                                    </v-btn>
                                </v-time-picker>
                            </v-menu>
                        </v-col>
                    </v-row>

                    <div class="text-center">
                       <router-link to="/">
                        <v-btn @click="submit" class="primary white--text mx-2 mt-3" text>
                            변경
                        </v-btn>
                        </router-link>
                        <router-link to="/">
                          <v-btn class="primary white--text mx-2 mt-3" text>
                            취소
                        </v-btn>
                        </router-link>
                    </div>
                </v-form>
            </v-card-text>
        </v-card>
</template>
<script>
    export default {
        data() {
            return {
                startTimer: false,
                endTimer: false,
                eventRules: [
                    v => !!v || '일정을 작성해주세요'
                ],
                endDateRules: [
                    v => v.search(/\d{4}-\d{2}-\d{2}/) === 0 || '종료일을 지정해주세요.'
                ]
            }
        },
        computed: {
            event() {
                return this.$store.state.calendar_data.event;
            },
        },
        methods: {
            submit() {
                  this.$store.commit('EDIT_EVENT', this.event);
            },
            selectTime() {
                this.endTimer = false;
                this.startTimer = false;
            },
            allowedDates(val) {
                let endDate = val.split('-').reduce((a, b) => a + b);
                let startDate = this.event.startDate.split('-').reduce((a, b) => a + b);
                return endDate >= startDate;
            },
        },
    }
</script>
