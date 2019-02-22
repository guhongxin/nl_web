import request from '@/utils/request'

// 体测录入
export function testInput(userInfo) {
  const data = {
    name: userInfo.name, // 姓名
    sex: userInfo.sex, // 性别
    phone: userInfo.phone, // 手机号码
    age: parseInt(userInfo.age), // 年龄
    head_portrait: userInfo.avatar, // 头像
    height: parseFloat(userInfo.height), // 身高
    weight: parseFloat(userInfo.weight), // 体重
    fat: userInfo.body_fat, // 体脂率
    infat: userInfo.visceral, // 内脂指数
    body_water: userInfo.water, // 水分
    muscle: userInfo.muscle, // 骨胳肌率
    fat_mineral: userInfo.fat, // 脂肌率
    mineral: userInfo.bone, // 骨矿含量
    protein: userInfo.protein, // 蛋白质
    waist_hip: userInfo.waist, // 腰臀比
    max_blood_pressure: userInfo.systolic, // 收缩压
    min_blood_pressure: userInfo.diastolic, // 舒张压
    sub_fat: userInfo.subcutaneous, // 皮下脂肪
    image: '', // 体测拍照
    examTime: userInfo.test_time, // 体测时间
    body_level: userInfo.fat_grade, // 体质等级
    resting_heart_rate: userInfo.heart_rate // 静态心率
  }
  return request({
    url: '/v1/gym/body_exams',
    method: 'post',
    data
  })
}
// 体侧列表
export function listTestReport(query) {
  return request({
    url: '/v1/gym/body_exams',
    method: 'get',
    params: query
  })
}
// 体侧列表
export function countList(query) {
  return request({
    url: '/v1/gym/body_amounts',
    method: 'get',
    params: query
  })
}
// 私教预约取消
export function coachCancel(id) {
  return request({
    url: '/v1/gym/course_consumes/' + id + '/cancel',
    method: 'POST'
  })
}
// 私教预约消课
export function coachCancelCourse(id, code) {
  return request({
    url: '/v1/gym/course_consumes/' + id + '/complete',
    method: 'POST',
    data: { code: code }
  })
}
// 私教购买消课
export function coachCancelByBuyCourse(data) {
  return request({
    url: '/v1/gym/customer_courses/' + data.customerCourseId + '/bookings/' + data.id + '/consume',
    method: 'POST',
    data: data
  })
}
// 私教预约添加
export function coachAdd(query) {
  return request({
    url: '/v1/gym/course_consumes',
    method: 'POST',
    data: query
  })
}
