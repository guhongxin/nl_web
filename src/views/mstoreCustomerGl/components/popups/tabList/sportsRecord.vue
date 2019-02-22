<template>
	<div class="sportsRecord">
    <div class="head-content">
      <el-row>
        <el-col :span="12" style="border-right:1px solid #D8D8D8">
          <el-row>
            <el-col :span="12">
              <h3>总消耗</h3>
              <p class="total-p">{{sportsTotal.run_total_calorie?sportsTotal.run_total_calorie/1000:'0'}}<span>kcal</span></p>
            </el-col>
            <el-col :span="12">
              <h3>总运动</h3>
              <p class="total-p">{{sportsTotal.run_total_sec?(sportsTotal.run_total_sec/60).toFixed(1):'0'}}<span>min</span></p>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
           <el-row>
            <el-col :span="8">
              <div class="statistical-box">
                <canvas ref="instrument" width="64" height="64"></canvas>
                <p class="canvas-introduction">
                  F1<span>器械</span>
                </p>
                <p class="canvas-data" v-if="this.sportMedal.data_force">  
                  {{this.sportMedal.data_force.amount}}/{{this.sportMedal.data_force.max_amount}}<span>{{this.sportMedal.data_force.unit}}</span>
                </p>
                <p class="canvas-data" v-else>-/-<span>-</span></p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="statistical-box">
                <canvas ref="aerobic" width="64" height="64"></canvas>
                <p class="canvas-introduction">
                  A0<span>有氧</span>
                </p>
                <p class="canvas-data" v-if="this.sportMedal.data_aerobic">
                  {{this.sportMedal.data_aerobic.amount}}/{{this.sportMedal.data_aerobic.max_amount}}<span>{{this.sportMedal.data_aerobic.unit}}</span>
                </p>
                <p class="canvas-data" v-else>-/-<span>-</span></p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="statistical-box">
                <canvas ref="walk" width="64" height="64"></canvas>
                <p class="canvas-introduction">
                  W2<span>步行</span>
                </p>
                <p class="canvas-data" v-if="this.sportMedal.data_walk">
                  {{this.sportMedal.data_walk.amount}}/{{this.sportMedal.data_walk.max_amount}}<span>{{this.sportMedal.data_walk.unit}}</span>
                </p>
                 <p class="canvas-data" v-else>-/-<span>-</span></p>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
		<el-table
			:data="tableData"
		  stripe 
      class="check-table reacord-table"
      v-loading="listLoading" 
      element-loading-text="列表正在加载中"
      border
      fit highlight-current-row
      style="width: 100%;">
			<el-table-column
				prop="sport_date"
				label="日期"
				align="center"
				>
        <template slot-scope="scope">
          <span>{{common.customFormat(scope.row.sport_date*1000, 'yyyy-MM-dd')}}</span>
        </template>
			</el-table-column>
			<el-table-column
				prop="sport_type_name"
				label="运动类型"
				align="center"
			>
        <template slot-scope="scope">
          <span>{{scope.row.sport_type_name}}</span>
        </template>
			</el-table-column>
			<el-table-column
				label="运动时长"
				align="center"
			>
        <template slot-scope="scope">
          <span v-if="scope.row.sport_content_type === 1">{{getRunContent(scope.row)/100000}}<span>{{getunit(scope.row.sport_content_type)}}</span></span>
          <span v-else-if="scope.row.sport_content_type === 2">{{getStrength_content(scope.row)}}<span>{{getunit(scope.row.sport_content_type)}}</span></span>
          <span v-else>{{getStepContent(scope.row)}}<span>{{getunit(scope.row.sport_content_type)}}</span></span>
        </template>
			</el-table-column>
			<el-table-column
				label="消耗卡路里"
				align="center"
			>
        <template slot-scope="scope">
          <span>{{(scope.row.sport_aerobic_calorie + scope.row.sport_anaerobic_calorie + scope.row.sport_stamina_calorie)/1000}} kcal</span>
        </template>
			</el-table-column>
		</el-table>
    <div class="pagination-container"  style="text-align:right;">
        <el-pagination
          v-if="paginationShow"
          background
          @current-change="handleCurrentChange" 
          :current-page.sync="page"
          prev-text="上一页"
          next-text="下一页"
          layout="prev, next">
        </el-pagination>
      </div>
	</div>
</template>
<script>
import { app_sports_medal, app_sports_total, app_sports_detail } from '@/api/customerGl'
export default {
  name: 'sportsRecord',
  props: ['dataList'],
  data() {
    return {
      tableData: [],
      listLoading: false,
      page: 1,
      per_page: 10,
      total: 0,
      paginationShow: true,
      customer_id: 0,
      firstId: [],
      lastId: 0,
      findId: 0,
      prev_page: 1,
      dotSpeed: 1,
      sportsTotal: {}, // 运动数据汇总
      sportMedal: {}, // 运动数据汇总
      sportdeg: {} // 运动数据角度 0-器械 1-有氧 2-步行
    }
  },
  created() {},
  mounted() {},
  methods: {
    // getList(id) {
    //   this.listLoading = true
    //   let obj = {
    //     last_id: this.findId,
    //     per_page: this.per_page
    //   }
    //   customerSport(id, obj)
    //     .then(res => {
    //       this.listLoading = false
    //       let data = res.data
    //       this.tableData = data
    //       this.lastId = this.tableData[this.per_page - 1].logid
    //       this.firstId = this.tableData[0].logid
    //     })
    //     .catch(() => {
    //       this.listLoading = false
    //     })
    // },
    handleCurrentChange(value) {
      if (this.prev_page === value) {
        this.prev_page = value
        return
      }
      if (this.prev_page > value) {
        this.prev_page = value
        this.page = value
        let _firstId = []
        _firstId = this.firstId.pop()
        if (_firstId && _firstId.length !== 0) {
          this.findId = _firstId[0]
        } else {
          this.findId = 0
        }
      } else if (this.prev_page < value) {
        if (this.tableData.length !== 0) {
          if (this.firstId.indexOf(this.tableData[0].sport_date) === -1) {
            if (this.firstId.length === 0) {
              // 第一页sport_date是从[0, this.tableData[this.tableData.length - 1].sport_date]
              this.firstId.push([0, this.tableData[this.tableData.length - 1].sport_date])
            } else {
              // 点击下页，如果本次this.tableData最后一个sport_date已经存入数组，就不再次存入
              if (this.firstId[this.firstId.length - 1].indexOf(this.tableData[this.tableData.length - 1].sport_date) === -1) {
                this.firstId.push([this.firstId[this.firstId.length - 1][1], this.tableData[this.tableData.length - 1].sport_date])
              }
            }
          }
          this.page = value
          this.prev_page = value
        } else {
          this.page = this.prev_page
        }
        this.findId = this.lastId
      }
      this.getapp_sports_detail(this.customer_id)
    },
    drawCanvas(doc, data, imgSrc) {
      if (doc === undefined) {
        return false
      }
      let ctx = doc.getContext('2d')
      ctx.save()
      ctx.clearRect(0, 0, doc.width, doc.height)
      ctx.translate(doc.width / 2, doc.height / 2)
      ctx.save()
      // 画外环
      ctx.rotate(134 * Math.PI / 180)
      ctx.beginPath()
      ctx.arc(0, 0, 30, 0, 1.5 * Math.PI, false)
      ctx.strokeStyle = '#EEEEEE'
      ctx.lineWidth = 2
      ctx.stroke()
      this.drawCanvasProgress(ctx, data)
      ctx.restore()
      // 画中心图片
      let img = new Image()
      img.src = imgSrc
      img.onload = function() {
        ctx.save()
        ctx.translate(doc.width / 2, doc.height / 2)
        ctx.translate(-8.5, -10.5)
        ctx.beginPath()
        ctx.drawImage(img, 0, 0, 17, 21)
        ctx.restore()
      }
      ctx.restore()
    },
    drawCanvasProgress(obj, data) {
      // 画进度
      obj.beginPath()
      obj.arc(0, 0, 30, 0, data * 1.5 * Math.PI, false)
      obj.strokeStyle = '#1AB394'
      obj.lineWidth = 2
      obj.stroke()
    },
    drawCanvasText(obj, text) {
      obj.fillStyle = '#000000'
      obj.font = '12px "微软雅黑"'
      obj.textAlign = 'center'
      obj.textBaseline = 'hanging'
      obj.fillText(text, 0, 0)
    },
    initData(id) {
      this.customer_id = id
      // 切换tab，将有些数据清掉
      this.sportsTotal = {}
      this.sportMedal = {}
      this.sportdeg = {}
      this.findId = 0
      this.prev_page = 1
      this.firstId = []
      this.lastId = 0
      // 请求数据
      this.getapp_sports_medal(id)
      this.getapp_sports_total(id)
      this.getapp_sports_detail(id)
    },
    getapp_sports_medal(id) {
      app_sports_medal(id).then(res => {
        let data = res.data
        for (let key in data) {
          if (key && data[key].medal) {
            this.sportMedal[key] = {
              max_amount: data[key].medal.max_amount,
              amount: data[key].medal.amount,
              unit: data[key].medal.unit
            }
            this.sportdeg[key] = data[key].medal.amount / data[key].medal.max_amount
          }
        }
        // 绘制canvas图
        this.$nextTick(() => {
          this.drawCanvas(this.$refs.instrument, this.sportdeg.data_force, require('@/assets/image/instrument2x.png'))
          this.drawCanvas(this.$refs.aerobic, this.sportdeg.data_aerobic, require('@/assets/image/aerobic2x.png'))
          this.drawCanvas(this.$refs.walk, this.sportdeg.data_walk, require('@/assets/image/walk2x.png'))
        })
      }).catch(err => {
        console.log(err)
      })
    },
    getapp_sports_total(id) {
      app_sports_total(id).then(res => {
        let data = res.data.data
        this.sportsTotal = data !== undefined ? data : {}
      }).catch(err => {
        console.log(err)
      })
    },
    getapp_sports_detail(id) {
      this.listLoading = true
      let obj = {
        last_sport_date: this.findId,
        per_page: this.per_page
      }
      app_sports_detail(id, obj).then(res => {
        let data = res.data.sport_data_list
        if (!data || data.length === 0) {
          // 如果请求数据返回为空，当前为上一页
          this.tableData = []
          this.page = this.prev_page
        } else {
          this.tableData = data
          this.lastId = this.tableData[this.tableData.length - 1].sport_date
        }
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
        // 如果请求数据失败，当前为上一页
        this.page = this.prev_page
      })
    },
    getunit(params) {
      let result = ''
      switch (params) {
        case 0:
          result = '步'
          break
        case 1:
          result = 'km'
          break
        case 2:
          result = '个'
          break
      }
      return result
    },
    getRunContent(param) {
      // 获取有氧运动
      if (!param.SportContent || !param.SportContent.RunContent || !param.SportContent.RunContent.total_distance) {
        return 0
      }
      return param.SportContent.RunContent.total_distance
    },
    getStepContent(param) {
      // 获取步数
      if (!param.SportContent || !param.SportContent.StepContent || !param.SportContent.StepContent.stepCount) {
        return 0
      }
      return param.SportContent.StepContent.stepCount
    },
    getStrength_content(param) {
      // 获取器械的
      if (!param.SportContent || !param.SportContent.strength_content || !param.SportContent.strength_content.total_distance) {
        return 0
      }
      return param.SportContent.strength_content.total_distance
    }
  }
}
</script>
<style lang="scss" scoped>
.sportsRecord{
  /deep/ .btn-next{
    padding-left: 10px;
    padding-right: 10px;
  }
  /deep/ .btn-prev{
    padding-left: 10px;
    padding-right: 10px;
  }
  .head-content {
    text-align: center;
    margin-bottom: 22px;
    margin-top: 32px;
    h3 {
      font-size: 16px;
      color: #000000;
    }
    .total-p {
      margin: 0px;
      font-size: 30px;
      color: #1AB394;
      font-weight: 600;
      span {
        font-size: 16px;
        color: #1AB394;
        line-height: 34px;
      }
    }
    .statistical-box {
      margin: 0px auto;
      .canvas-introduction {
        font-size: 22px;
        color: #1AB394;
        letter-spacing: 0;
        text-align: center;
        margin-top: -5px;
        margin-bottom: 0px;
        font-style: oblique;
        font-weight: 600;
        span {
          font-weight: normal;
          font-style: normal;
          font-size: 14px;
          color: #2A2A2A;
          letter-spacing: 0;
          text-align: center;
          line-height: 19px;
          margin-left: 6px;
        }
      }
      .canvas-data{
        line-height: 0px;
      }
    }
  }
}
</style>
