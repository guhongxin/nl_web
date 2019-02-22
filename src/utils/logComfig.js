let editTemplate = '${flag}：${flag} → ${flag}'
exports.actionValue = [
  /* 会员修改/潜客修改 */
  {
    num: 800,
    text: '添加',
    key: 'customer-create',
    template: '-',
    type: 'member-modification'
  },
  {
    num: 801,
    text: '修改',
    key: 'customer-update',
    template: editTemplate,
    isEdit: true,
    type: 'member-modification'
  },
  {
    num: 803,
    text: '分配会籍',
    key: 'customer-consultant',
    template: '分配至会籍：会籍名称[手机号码]',
    keyArr: [''],
    type: 'member-modification'
  },
  {
    num: 804,
    text: '分配教练',
    key: 'customer-coach',
    template: '分配至教练：教练名称[手机号码]',
    keyArr: [''],
    type: 'member-modification'
  },
  {
    num: 805,
    text: '删除',
    key: 'customer-delete',
    template: '-',
    type: 'member-modification'
  },
  {
    num: 810,
    text: '恢复',
    key: 'customer-restore',
    template: '-',
    type: 'member-modification'
  },
  {
    num: 806,
    text: '批量删除',
    key: 'customer-batdelete',
    template: '批量删除 ${flag} 个用户',
    keyArr: ['card_num'],
    type: 'member-modification'
  },
  {
    num: 807,
    text: '批量分配教练',
    key: 'customer-batcoach',
    template: '批量分配 ${flag} 个用户至教练：${flag}[${flag}]',
    keyArr: ['card_num', '0.new.coach.name', '0.new.coach.phone'],
    type: 'member-modification'
  },
  {
    num: 808,
    text: '批量分配会籍',
    key: 'customer-batcon',
    template: '批量分配 ${flag} 个用户至会籍：${flag}[${flag}]',
    keyArr: ['card_num', '0.new.consultant.name', '0.new.consultant.phone'],
    type: 'member-modification'
  },
  {
    num: 809,
    text: '批量恢复',
    key: 'customer-batrestore',
    template: '批量恢复 ${flag} 个用户',
    keyArr: ['card_num'],
    type: 'member-modification'
  },
  /* 会员卡记录 */
  {
    num: 100,
    text: '办理',
    key: 'card-add',
    template: '开卡日期：${flag} / 失效日期：${flag}',
    keyArr: ['new.start_date', 'new.end_date'],
    type: 'membership-card-records'
  },
  {
    num: 101,
    text: '开卡',
    key: 'card-active',
    template: '设定开卡日期：${flag} / 实际日期：${flag}',
    keyArr: ['new.end_date', 'new.start_date'],
    type: 'membership-card-records'
  },
  {
    num: 102,
    text: '停卡',
    key: 'card-prestop',
    template: '停卡时间：${flag} 至 ${flag}',
    keyArr: ['dirty.start_date', 'dirty.end_date'],
    type: 'membership-card-records'
  },
  {
    num: 103,
    text: '扣次',
    key: 'card-usetimes',
    template: '扣次数量：${flag} 次',
    keyArr: ['use_times'],
    type: 'membership-card-records'
  },
  {
    num: 104,
    text: '结束停卡',
    key: 'card-cancelstop',
    template: '设定停卡时间：${flag} 至 ${flag}',
    keyArr: ['dirty.start_date', 'dirty.end_date'],
    type: 'membership-card-records'
  },
  {
    num: 105,
    text: '续卡',
    key: 'card-renew',
    template: [
      '增加天数：${flag} 天',
      '增加次数：${flag} 次',
      '增加金额：${flag} 元'
    ],
    keyArr: ['end_date', 'total_times', 'balance'],
    type: 'membership-card-records'
  },
  {
    num: 106,
    text: '转卡',
    key: 'card-transfer',
    template: '卡主：${flag}[${flag}] → ${flag}[${flag}]',
    keyArr: ['old.customer_name', 'old.customer_phone', 'new.customer_name', 'new.customer_phone'],
    type: 'membership-card-records'
  },
  {
    num: 107,
    text: '编辑',
    key: 'card-update',
    template: editTemplate,
    isEdit: true,
    type: 'membership-card-records'
  },
  {
    num: 108,
    text: '删除',
    key: 'card-delete',
    template: '-',
    type: 'membership-card-records'
  },
  {
    num: 109,
    text: '彻底删除',
    key: 'card-forcedelete',
    template: '-',
    type: 'membership-card-records'
  },
  {
    num: 110,
    text: '锁定',
    key: 'card-lock',
    template: '锁定原因：${flag}',
    type: 'membership-card-records'
  },
  {
    num: 111,
    text: '解锁',
    key: 'card-unlock',
    template: '-',
    type: 'membership-card-records'
  },
  {
    num: 112,
    text: '批量删除',
    key: 'card-batdelete',
    template: '批量删除 <span>${flag}</span> 张卡',
    keyArr: ['card_num'],
    type: 'membership-card-records'
  },
  {
    num: 113,
    text: '批量恢复',
    key: 'card-batrestore',
    template: '批量恢复 <span>${flag}</span> 张卡',
    keyArr: ['card_num'],
    type: 'membership-card-records'
  },
  {
    num: 114,
    text: '批量锁定',
    key: 'card-batlock',
    template: '批量锁定 <span>${flag}</span> 张卡',
    keyArr: ['card_num'],
    type: 'membership-card-records'
  },
  {
    num: 115,
    text: '批量解锁',
    key: 'card-batunlock',
    template: '批量解锁 <span>${flag}</span> 张卡',
    keyArr: ['card_num'],
    type: 'membership-card-records'
  },
  {
    num: 116,
    text: '批量开卡',
    key: 'card-batactive',
    template: '批量开了 <span>${flag}</span> 张卡',
    keyArr: ['card_num'],
    type: 'membership-card-records'
  },
  {
    num: 117,
    text: '恢复',
    key: 'card-restore',
    template: '-',
    type: 'membership-card-records'
  },
  /* 私教记录 */
  {
    num: 300,
    text: '添加',
    key: 'course-store',
    template: '-',
    type: 'private-education-course'
  },
  {
    num: 301,
    text: '编辑',
    key: 'course-update',
    template: editTemplate,
    isEdit: true,
    type: 'private-education-course'
  },
  {
    num: 302,
    text: '删除',
    key: 'course-destroy',
    template: '-',
    type: 'private-education-course'
  },
  {
    num: 303,
    text: '添加带课教练',
    key: 'course-addcoach',
    template: '教练姓名:${flag} / 课程单价:${flag}',
    keyArr: ['new.coach.name', 'new.price'],
    type: 'private-education-course'
  },
  {
    num: 304,
    text: '删除带课教练',
    key: 'course-removecoach',
    template: '教练姓名：${flag} / 课程单价：${flag}',
    keyArr: ['new.coach.name', 'new.price'],
    type: 'private-education-course'
  },
  {
    num: 305,
    text: '编辑带课教练',
    key: 'course-updatecoach',
    template: editTemplate,
    isEdit: true,
    type: 'private-education-course'
  },
  {
    num: 306,
    text: '批量删除带课教练',
    key: 'course-batremovecoach',
    template: '批量删除 <span>${flag}</span> 个教练',
    keyArr: ['card_num'],
    type: 'private-education-course'
  },
  /* 私教购买修改记录 */
  {
    num: 400,
    text: '编辑',
    key: 'course-customer-update',
    template: editTemplate,
    isEdit: true,
    type: 'private-education-purchase'
  },
  {
    num: 401,
    text: '删除',
    key: 'course-customer-delete',
    template: '课程名称：${flag} \n 教练姓名：${flag} \n 课程次数：${flag} \n 失效日期：${flag} ',
    keyArr: ['new.course_data.name', 'new.coach_name', 'new.quantity', 'new.expired_at'],
    type: 'private-education-purchase'
  },
  {
    num: 402,
    text: '批量删除',
    key: 'course-customer-batdelete',
    template: '批量删除 <span>${flag}</span> 条购买',
    keyArr: ['card_num'],
    type: 'private-education-purchase'
  },
  {
    num: 403,
    text: '添加',
    key: 'course-customer-store',
    template: '课程名称：${flag} \n 教练姓名：${flag} \n 课程次数：${flag} \n 失效日期：${flag}-timeBrfore \n 实付金额：${flag}',
    keyArr: ['new.course.name', 'new.coach_name', 'new.quantity', 'new.expired_at', 'new.course_order.real_total_fee'],
    type: 'private-education-purchase'
  },
  /* 私教预约修改记录 */
  {
    num: 450,
    text: '添加',
    key: 'course-customer-booking',
    template: '课程名称：${flag} \n 教练姓名：${flag} \n 课程次数：剩 ${flag} 次 \n 失效日期：${flag}',
    keyArr: ['new.course_name', 'new.customer_course.coach_name', 'new.customer_course.residue', 'new.customer_course.expired_at'],
    type: 'private-appointment'
  },
  {
    num: 451,
    text: '取消',
    key: 'course-customer-cancel',
    template: '课程名称：${flag} \n 教练姓名：${flag} \n 课程次数：剩 ${flag} 次 \n 失效日期：${flag}',
    keyArr: ['new.course_name', 'new.customer_course.coach_name', 'new.customer_course.residue', 'new.customer_course.expired_at'],
    type: 'private-appointment'
  },
  {
    num: 452,
    text: '消课',
    key: 'course-customer-confirm',
    template: '课程名称：${flag} \n 教练姓名：${flag} \n 课程次数：剩 ${flag} 次 \n 失效日期：${flag}',
    keyArr: ['new.course_name', 'new.coach_name', 'new.residue', 'new.expired_at'],
    type: 'private-appointment'
  },
  // 课程修改
  {
    num: 500,
    text: '添加课程',
    key: 'group-course-store',
    template: '教练姓名：${flag} / 课程价格：${flag}',
    keyArr: ['new.coach.name', 'new.price'],
    type: 'recordEdit'
  },
  {
    num: 501,
    text: '编辑课程',
    key: 'group-course-update',
    template: editTemplate,
    isEdit: true,
    type: 'recordEdit'
  },
  {
    num: 502,
    text: '删除课程',
    key: 'group-course-delete',
    template: '教练姓名：${flag} / 课程价格：${flag}',
    keyArr: ['new.name', 'new.price'],
    type: 'recordEdit'
  },
  // 排期修改
  {
    num: 600,
    text: '添加排期',
    key: 'group-course-schedule-store',
    template: '起始日期：${flag}-timeBrfore / 上课时间：${flag}-timeAfter-${flag}-timeAfter \n ...',
    keyArr: ['0.new.course_date', '0.new.start_at', '0.new.end_at'],
    type: 'recordEdit'
  },
  {
    num: 601,
    text: '编辑排期',
    key: 'group-course-schedule-update',
    template: editTemplate,
    isEdit: true,
    type: 'recordEdit'
  },
  {
    num: 602,
    text: '删除排期',
    key: 'group-course-schedule-delete',
    template: '日期：${flag}-timeBrfore / 上课时间：${flag}-timeAfter-${flag}-timeAfter',
    keyArr: ['new.course_date', 'new.start_at', 'new.end_at'],
    type: 'recordEdit'
  },
  // 预约修改
  {
    num: 700,
    text: '取消',
    key: 'group-course-reserve-cancel',
    template: '课程名称：${flag} / 教练姓名：${flag} / 预约上课时间：${flag}',
    keyArr: ['new.name', 'new.coach.name', 'new.start_at'],
    type: 'appointmentEdit'
  },
  {
    num: 701,
    text: '批量取消',
    key: 'group-course-reserve-batcancel',
    template: '批量取消 <span>${flag}</span> 条预约',
    keyArr: ['card_num'],
    type: 'appointmentEdit'
  },
  {
    num: 702,
    text: '添加',
    key: 'group-course-reserve-store',
    template: '课程名称：${flag} / 教练姓名：${flag} / 预约上课时间：${flag}',
    keyArr: ['new.name', 'new.coach.name', 'new.start_at'],
    type: 'appointmentEdit'
  },
  // 公开课记录
  {
    num: 900,
    text: '添加',
    key: 'group-course-store',
    template: '上课时间：${flag} - ${flag}',
    keyArr: ['new.time_start', 'new.time_end'],
    type: 'publicRecord'
  },
  {
    num: 901,
    text: '编辑',
    key: 'group-course-update',
    template: editTemplate,
    isEdit: true,
    type: 'publicRecord'
  },
  {
    num: 902,
    text: '删除',
    key: 'group-course-delete',
    template: '上课时间：${flag} - ${flag}',
    keyArr: ['new.time_start', 'new.time_end'],
    type: 'publicRecord'
  },
]
exports.remarkConfig = {
  address: '上课地点',
  coach_name: '教练姓名',
  min_person: '最小上课人数',
  max_person: '最大上课人数',
  name: '课程名称',
  effect: '课程类型',
  hall_name: '场地名称',
  is_app_sale: '是否APP销售',
  J: '减脂',
  Z: '增肌',
  S: '塑形',
  time_start: '上课开始时间',
  time_end: '上课结束时间',
  week: '星期',
  // 会员卡记录
  card_name: '卡种名称',
  card_image: '会员卡背景',
  card_no: '会员卡号',
  end_date: '失效时间',
  start_date: '开卡时间',
  remark: '备注',
  // 私教记录
  time: '课程时长',
  image: '课程封面',
  fit_type: '课程类型',
  app_status: '课程状态',
  introduce: '课程介绍',
  is_hot: '热门显示',
  price: '单价',
  coach_id: '教练姓名',
  end_at: '结束时间',
  start_at: '开始时间',
  course_date: '日期',
  course_name: '课程名称',
  expired_at: '失效时间',
  /* 会员 */
  sex: '性别',
  birthday: '生日',
  id_card_no: '身份证',
  intent_level: '意向程度',
  channel: '来源渠道',
  purpose: '健身目的',
  consultant_name: '会籍名称',
  head_portrait: '会员头像',
  phone: '手机号'
}
