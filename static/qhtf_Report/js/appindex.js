var result = {
  "message": "DataUpload",
  "UUID": "ABC-001",               //单位代码
  "deviceID": "16ART1B0007",       //仪器编号
  "deviceType": "BCA-1D",              //仪器型号
  "memberId": "13902345678",       //测试者编号
  "testID": "201704281014",         //测试序号
  "testDate": "20170428",            //测试日期
  "name": "张三",               //姓名（UTF-8编码）
  "sex": "1",                    //性别 （男1，女2）
  "height": "178.5",              //身高
  "birthYear": "1985",            //出生年份
  "Weight": "72.5",              //体重
  "Fat": "23.1",                 //脂肪
  "Bone": "3.8",                //骨质
  "Protein": "18.6",             //蛋白质
  "Water": "33.5",              //水分
  "Muscle": "40.1",             //肌肉
  "SMM": "18.5",              //骨骼肌
  "PBF": "22.1",               //体脂百分比
  "BMI": "22.4",              //体质指数
  "BMR": "1665.0",           //基础代谢
  "WHR": "0.89",            //腰臀比（2位小数）
  "Edema": "0.33",           //水肿系数（2位小数）
  "VFI": "12.0",             //内脏脂肪指数
  "BodyAge": "23",          //身体年龄
  "Score": "78.0",            //健康评分
  "BodyType": "4",          //体型判定
  "LBM": "50.1",            //瘦体重（去脂体重）
  "ICW": "23.0",            //细胞内液
  "ECW": "10.5",           //细胞外液
  "Standard_weight": "70.5",   //目标体重
  "Weight_control": "2.0",   //体重控制
  "Fat_control": "1.3",      //脂肪控制量
  "Muscle_control": "0.7",  //肌肉控制量
  "LiverRisk": "65",        //脂肪肝风险系数
  "TR_fat": "14.5",        //躯干脂肪量
  "LA_fat": "2.1",         //左上肢脂肪
  "RA_fat": "2.1",         //右上肢脂肪
  "LL_fat": "5.2",         //左下肢脂肪
  "RL_fat": "5.2",         //右下肢脂肪
  "TR_water": "17.9",     //躯干水分量
  "LA_water": "2.6",      //左上肢水分
  "RA_water": "2.9",      //右上肢水分
  "LL_water": "4.2",      //左下肢水分
  "RL_water": "4.3",      //右下肢水分
  "TR_muscle": "23.9",     //躯干肌肉量
  "LA_muscle": "6.6",      //左上肢肌肉
  "RA_muscle": "6.9",      //右上肢肌肉
  "LL_muscle": "14.2",      //左下肢肌肉
  "RL_muscle": "14.3",      //右下肢肌肉
  "WeightMax": "84.5",    //体重正常范围的高值
  "WeightMin": "69.5",    //体重正常范围的低值
  "FatMax": "22.5",      //体重正常范围的高值
  "FatMin": "13.6",      //体重正常范围的低值
  "BoneMax": "3.7",    //骨质正常范围的高值
  "BoneMin": "3.1",    //骨质正常范围的低值
  "ProteinMax": "22.5",    //蛋白质正常范围的高值
  "ProteinMin": "17.5",    //蛋白质正常范围的低值
  "WaterMax": "43.6",    //水分正常范围的高值
  "WaterMin": "32.5",    //水分正常范围的低值
  "MuscleMax": "54.5",    //肌肉正常范围的高值
  "MuscleMin": "36.5",    //肌肉正常范围的低值
  "SMMMax": "32.5",    //骨骼肌正常范围的高值
  "SMMMin": "24.1",    //骨骼肌正常范围的低值
  "PBFMax": "10.0",    //体脂率正常范围的高值
  "PBFMin": "20.0",    //体脂率正常范围的低值
  "BMIMax": "18.5",    //体质指数正常范围的高值
  "BMIMin": "23.9",    //体质指数正常范围的低值
  "WHRMax": "0.7",    //腰臀比正常范围的高值
  "WHRMin": "0.8",    //腰臀比正常范围的低值
  "EdemaMax": "0.3",    //水肿系数正常范围的高值
  "EdemaMin": "0.35",    //水肿系数正常范围的低值
  "VFIMax": "5",    //内脏脂肪指数正常范围的高值
  "VFIMin": "10"    //内脏脂肪指数正常范围的低值
}
var bodyType = ["隐形肥胖型", "肌肉不足型", "消瘦型", "脂肪过多型", "健康匀称型", "低脂肪型", "肥胖型", "超重肌肉型", "运动员型"]
renderResult(result)
function renderResult(result) {
  $('#health_score').text(result.Score)
  $('#body_age').text(result.BodyAge)
  $('#body_bmr').text(result.BMR)
  setValue($('.table-baseinfo dd:eq(0)'), result.Weight, result.WeightMin, result.WeightMax)
  setValue($('.table-baseinfo dd:eq(1)'), result.Fat, result.FatMin, result.FatMax)
  setValue($('.table-baseinfo dd:eq(2)'), result.PBF, result.PBFMin, result.PBFMax)
  setValue($('.table-baseinfo dd:eq(3)'), result.Water, result.WaterMin, result.WaterMax)
  setValue($('.table-baseinfo dd:eq(4)'), result.Muscle, result.MuscleMin, result.MuscleMax)
  setValue($('.table-baseinfo dd:eq(5)'), result.Protein, result.ProteinMin, result.ProteinMax)
  setValue($('.table-baseinfo dd:eq(6)'), result.Bone, result.BoneMin, result.BoneMax)
  setValue($('.table-baseinfo dd:eq(7)'), result.BMI, result.BMIMin, result.BMIMax)
  setValue($('.table-baseinfo dd:eq(8)'), result.VFI, result.VFIMin, result.VFIMax)
  setValue($('.table-baseinfo dd:eq(9)'), result.LiverRisk)
  $('.table-baseinfo dd:eq(10) span:nth-child(3)').text(bodyType[result.BodyType - 1])
  /* 人体图形数据 */
  $('#Analysis_of_obesity_date .flex-left p:eq(0)').text(result.LA_fat)
  $('#Analysis_of_obesity_date .flex-left p:eq(2)').text(result.LL_fat)
  $('#Analysis_of_obesity_date .flex-right p:eq(0)').text(result.RA_fat)
  $('#Analysis_of_obesity_date .flex-right p:eq(2)').text(result.RL_fat)
  $('#Analysis_of_muslc_date .flex-left p:eq(0)').text(result.LA_muscle)
  $('#Analysis_of_muslc_date .flex-left p:eq(2)').text(result.LL_muscle)
  $('#Analysis_of_muslc_date .flex-right p:eq(0)').text(result.RA_muscle)
  $('#Analysis_of_muslc_date .flex-right p:eq(2)').text(result.RL_muscle)
  /* 底部表格数据 */
  $('#bodyWeight span:eq(1)').text(result.Standard_weight?result.Standard_weight:"--")
  $('#bodyWeight span:eq(3)').text(result.Weight_control?result.Weight_control:"--")
  $('#bodyWeight span:eq(5)').text(result.Fat_control?result.Fat_control:"--")
  $('#bodyWeight span:eq(7)').text(result.Muscle_control?result.Muscle_control:"--")
  /* echarts */
  var echartsArr = [
    {
      el: 'BasicComponents',
      baseDate: [
        {name: '骨质', value: result.Bone, min: result.BoneMin, max: result.BoneMax},
        {name: '蛋白质', value: result.Protein, min: result.ProteinMin, max: result.ProteinMax},
        {name: '脂肪', value: result.Fat, min: result.FatMin, max: result.FatMax},
        {name: '水分', value: result.Water, min: result.WaterMin, max: result.WaterMax},
      ]
    },
    {
      el: 'Analysis_of_obesity',
      baseDate: [
        {name: '腰臀比', value: result.WHR, min: result.WHRMin, max: result.WHRMax},
        {name: '内脏脂肪', value: result.VFI, min: result.VFIMin, max: result.VFIMax},
        {name: '体脂率', value: result.PBF, min: result.PBFMin, max: result.PBFMax},
        {name: '体质指数', value: result.BMI, min: result.BMIMin, max: result.BMIMax},
      ]
    },
    {
      el: 'Analysis_of_muslc',
      baseDate: [
        {name: '蛋白质', value: result.Protein, min: result.ProteinMin, max: result.ProteinMax},
        {name: '骨骼肌', value: result.SMM, min: result.SMMMin, max: result.SMMMax},
        {name: '肌肉', value: result.Muscle, min: result.MuscleMin, max: result.MuscleMax},
      ]
    }
  ]
  console.log(echartsArr);
  var echartsObj = {}
  $.each($('.echarts-date .echarts-item'), function (i, v) {
    if (i < echartsArr.length) {
      var yAxisDate = [], xSeriesDate = [], lineColor = []
      $.each(echartsArr[i].baseDate, function (index, item) {
        yAxisDate.push(item.name)
        xSeriesDate.push((Number(item.value) * 2 / (Number(item.min) + Number(item.max))).toFixed(2))
        if (Number(item.value) < Number(item.min) || Number(item.value) > Number(item.max)) {
          lineColor.push('#CC0000')
        }else {
          lineColor.push('#009900')
        }
      })
      console.log(lineColor);
      echartsObj[echartsArr[i].el + 'Charts'] = echarts.init(document.getElementById(echartsArr[i].el))
      echartsObj[echartsArr[i].el + 'Options'] = {
        tooltip: {
          trigger: 'axis'
        },
        yAxis: {
          type: 'category',
          data: yAxisDate
        },
        grid: {
          left: '0%',
          right: '3%',
          top: '10%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          splitNumber: 14,
          min: 0.3,
          max: 1.7
        },
        series: [{
          data: xSeriesDate,
          type: 'bar',
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = lineColor;
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      }
      echartsObj[echartsArr[i].el + 'Charts'].setOption(echartsObj[echartsArr[i].el + 'Options'])
    }
  })
}
function setValue(el, date, min, max) {
  el.children('span').eq(2).text(date)
  if (min && max) {
    el.children('span').eq(3).text(min + '-' + max)
    /*
    * <i class="iconfont icon-icondown"></i>
    * <i class="iconfont icon-iconup"></i>
    * */
    if (Number(date) < Number(min)) {
      el.children('span').eq(0).html('<i class="iconfont icon-icondown"></i>')
    } else if (Number(date) > Number(max)) {
      el.children('span').eq(0).html('<i class="iconfont icon-iconup"></i>')
    } else {
      el.children('span').eq(0).html('')
    }
  }
}


















