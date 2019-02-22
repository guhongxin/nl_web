<template>
  <div class="dashboard-editor-container">
    <div class="selecter-b">
      <label>
        时间：
        <el-radio-group v-model="dateMode" @change="radioGroupChage" fill="#1AB394" >
          <el-radio-button v-for="(item,key) in options" :key="key" :label="item.label"></el-radio-button>
        </el-radio-group>
      </label>
      <el-date-picker
        v-model="chooseDate"
        :type="dateType"
        :format="format"
        :clearable="false"
        :editable="false"
        :picker-options="{firstDayOfWeek:1}"
        :placeholder="title" 
        @change="changeTime"
        class="date-picker-box">
      </el-date-picker>
      <span style="margin-left:30px;font-weight:bolder;">指标：
        <el-select v-model="sourceValue" 
          placeholder="请选择"  @change="sourceChange"
          style="width:155px">
          <el-option
            v-for="(item, key) in sourceIncome"
            :key="key"
            :label="item.label"
            :value="item.type">
          </el-option>
        </el-select>  
      </span>
      <span class="Rrrefresh" @click="__init">
        <el-button icon="el-icon-refresh" circle></el-button>
      </span>
    </div>
    <!-- 头部tab -->
    <div class="panel-group-box">
      <panel-group @handleSetLineChartData="handleSetLineChartData" :panel-value='panelValue' ref="panelGroup"></panel-group>
    </div>
    <!-- lineChart -->
    <el-row style="background:#fff;padding:16px 16px 0;border:1px solid #cccccc;border-bottom:none">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row>
    <el-row>
      <!-- 饼状图 -->
      <el-col :xs="24" :sm="24" :lg="10">
        <div class="chart-wrapper" style="border-right:none">
          <pie-chart :chart-data="pieChartData"></pie-chart>
        </div>
      </el-col>
      <!-- 柱状图 -->
      <el-col :xs="24" :sm="24" :lg="14">
        <div class="chart-wrapper" style="margin-bottom:30px">
          <bar-chart :chart-data="barChartData"></bar-chart>
        </div>
      </el-col>
    </el-row>

    <!-- table -->
    <el-row style="background:#fff;">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 14}" :xl="{span: 14}">
        <transaction-table :chart-data="transactionTable" :chart-head="transactionThead"></transaction-table>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 10}" :xl="{span: 10}" style="height:826px;border-left: 20px solid #f0f0f0">
        <record-table
          v-on:changeTable="changeTabler"
          :chart-data="totalTableList" 
          :chart-head="transactionThead" 
          :chart-title="tableTitle"
          class="recordTableHt"
          ></record-table>
        <div class="myDiv" @click="GoTo">
          <span>点击此处，查看更多详情 > </span>
        </div>
      </el-col>
    </el-row>

    <!-- 总业绩 -->
    <!-- <el-dialog
      title="总业绩"
      :visible.sync="totalVisible"
      width="80%" class="statistics-dialog" @close="addclose">
      <div class="contian">
        <div class="selecter">
          <label>
            时间：
            <el-radio-group v-model="dateMode" @change="radioGroupChage" fill="#1AB394">
              <el-radio-button v-for="(item,key) in options" :key="key" :label="item.label"></el-radio-button>
            </el-radio-group>
          </label>
          <el-date-picker
            v-model="chooseDate"
            :type="dateType"
            :format="format"
            :placeholder="title"
            :clearable="false"
            :editable="false"
            :picker-options="{firstDayOfWeek:1}" 
            @change="changeTime"
            class="date-picker-box">
          </el-date-picker>
          <label style="margin-left:20px">业绩：
            <el-select v-model="sourceValue1" placeholder="请选择" @change="handleCommand">
              <el-option label="总业绩排行" :value="0"></el-option>
              <el-option label="售卡业绩排行" :value="1"></el-option>
              <el-option label="私教课业绩排行" :value="2"></el-option>
              <el-option label="团课业绩排行" :value="3"></el-option>
              <el-option label="购物业绩排行" :value="4"></el-option>
            </el-select>  
          </label>
        </div>
        <div class="achievement-box">
          <rectbox :data="totalRextlist"></rectbox>
        </div>
        <el-table @sort-change="sortChange" stripe :key='tableKey' :data="tableList?tableList.slice((listQuery.page-1)*listQuery.per_page,listQuery.page*listQuery.per_page):tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
          style="width: 100%;" class="check-table">
          <el-table-column align="center" :label="'序号'" type="index" width="50">
            <template slot-scope="scope">
              <span>{{(scope.$index + 1)  +  (listQuery.page-1)*listQuery.per_page}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'员工姓名'" width="250" prop="scope.row.name">
            <template slot-scope="scope">
              <span>{{scope.row.employee.name}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'手机号码'" prop="scope.row.phone">
            <template slot-scope="scope">
              <span>{{scope.row.employee.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'售卡业绩'" prop="scope.row.card_sale">
            <template slot-scope="scope">
              <span>{{scope.row.card_sale}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'私教课业绩'" prop="scope.row.course_sale">
            <template slot-scope="scope">
              <span>{{scope.row.course_sale}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'团课业绩'" prop="scope.row.group_course_sale">
            <template slot-scope="scope">
              <span>{{scope.row.group_course_sale}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'购物业绩'" prop="scope.row.goods_sale">
            <template slot-scope="scope">
              <span>{{scope.row.goods_sale}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'其他业绩'" prop="scope.row.card_stop_sale">
            <template slot-scope="scope">
              <span>{{Math.floor(scope.row.card_stop_sale * 100) / 100 + Math.floor(scope.row.card_transfer_sale * 100) / 100}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container" style="text-align:right">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
            :page-sizes="[10,20,30,50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>

      </div>
    </el-dialog> -->

    <!-- 售卡业绩 -->
    <!-- <el-dialog
      title="售卡业绩"
      :visible.sync="openVisible"
      width="80%" class="statistics-dialog" @close="addclose">
      <div class="contian">
        <div class="selecter">
          <label>
            时间：
            <el-radio-group v-model="dateMode" @change="radioGroupChage" fill="#1AB394">
              <el-radio-button v-for="(item,key) in options" :key="key" :label="item.label"></el-radio-button>
            </el-radio-group>
          </label>
          <el-date-picker
            v-model="chooseDate"
            :type="dateType"
            :clearable="false"
            :editable="false"
            :picker-options="{firstDayOfWeek:1}" 
            :format="format"
            :placeholder="title" @change='changeTime'>
          </el-date-picker>
          <label style="margin-left:20px">业绩：
            <el-select v-model="sourceValue1" placeholder="请选择"  @change="handleCommand">
              <el-option label="总业绩排行" :value="0"></el-option>
              <el-option label="售卡业绩排行" :value="1"></el-option>
              <el-option label="私教课业绩排行" :value="2"></el-option>
              <el-option label="团课业绩排行" :value="3"></el-option>
              <el-option label="购物业绩排行" :value="4"></el-option>
            </el-select>  
          </label>
        </div>
        <div class="achievement-box">
          <rectbox :data="openCardlist"></rectbox>
        </div>
        <el-table @sort-change="sortChange" stripe :key='tableKey' :data="tableList?tableList.slice((listQuery.page-1)*listQuery.per_page,listQuery.page*listQuery.per_page):tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
          style="width: 100%;">
          <el-table-column align="center" :label="'序号'" type="index" width="50">
            <template slot-scope="scope">
              <span>{{(scope.$index + 1)  +  (listQuery.page-1)*listQuery.per_page}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'员工姓名'" width="250" prop="scope.row.name">
            <template slot-scope="scope">
              <span>{{scope.row.employee.name}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'手机号码'" prop="scope.row.phone">
            <template slot-scope="scope">
              <span>{{scope.row.employee.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'售卡业绩'" sortable prop="card_sale">
            <template slot-scope="scope">
              <span>{{scope.row.card_sale}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'潜客录入'" sortable prop="pc_count">
            <template slot-scope="scope">
              <span>{{scope.row.pc_count}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'售卡数量'" sortable prop="card_count">
            <template slot-scope="scope">
              <span>{{scope.row.card_count}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'售卡人数'" sortable min-width="230" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <span>{{scope.row.ccobc}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container" style="text-align:right">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
            :page-sizes="[10,20,30, 50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>

      </div>
    </el-dialog> -->

    <!-- 私教业绩 -->
    <!-- <el-dialog
      title="私教业绩"
      :visible.sync="privateVisible"
      width="80%" class="statistics-dialog" @close="addclose">
      <div class="contian">
        <div class="selecter">
          <label>
            时间：
            <el-radio-group v-model="dateMode" @change="radioGroupChage" fill="#1AB394">
              <el-radio-button v-for="(item,key) in options" :key="key" :label="item.label"></el-radio-button>
            </el-radio-group>
          </label>
          <el-date-picker
            v-model="chooseDate"
            :type="dateType"
            :format="format"
            :clearable="false"
            :editable="false"
            :picker-options="{firstDayOfWeek:1}" 
            :placeholder="title" @change='changeTime'>
          </el-date-picker>
          <label style="margin-left:20px">业绩：
            <el-select v-model="sourceValue1" placeholder="请选择"  @change="handleCommand">
              <el-option label="总业绩排行" :value="0"></el-option>
              <el-option label="售卡业绩排行" :value="1"></el-option>
              <el-option label="私教课业绩排行" :value="2"></el-option>
              <el-option label="团课业绩排行" :value="3"></el-option>
              <el-option label="购物业绩排行" :value="4"></el-option>
            </el-select>  
          </label>
        </div>
        <div class="achievement-box">
          <rectbox :data="privatelist"></rectbox>
        </div>
        <el-table @sort-change="sortChange" stripe :key='tableKey' :data="tableList?tableList.slice((listQuery.page-1)*listQuery.per_page,listQuery.page*listQuery.per_page):tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
          style="width: 100%;">
          <el-table-column align="center" :label="'序号'" type="index" width="50">
            <template slot-scope="scope">
              <span>{{(scope.$index + 1)  +  (listQuery.page-1)*listQuery.per_page}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'员工姓名'" width="250" prop="scope.row.name">
            <template slot-scope="scope">
              <span>{{scope.row.employee.name}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'手机号码'" prop="scope.row.phone">
            <template slot-scope="scope">
              <span>{{scope.row.employee.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'私教课业绩'" sortable prop="scope.row.phone">
            <template slot-scope="scope">
              <span>{{scope.row.course_sale}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'售出私教课'" sortable prop="scope.row.phone">
            <template slot-scope="scope">
              <span>{{scope.row.course_count}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'完成私教课'" sortable prop="scope.row.phone">
            <template slot-scope="scope">
              <span>{{scope.row.complete_course_count}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'待评价私教课'" sortable prop="scope.row.phone">
            <template slot-scope="scope">
              <span>{{scope.row.commenting_course_count}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'评价'" sortable min-width="230" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <span>{{scope.row.comment_course_star}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container" style="text-align:right">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
            :page-sizes="[10,20,30, 50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </el-dialog> -->

    <!-- 团课业绩 -->
    <!-- <el-dialog
      title="团课业绩"
      :visible.sync="groupVisible"
      width="80%" class="statistics-dialog" @close="addclose">
      <div class="contian">
        <div class="selecter">
          <label>
            时间：
            <el-radio-group v-model="dateMode" @change="radioGroupChage" fill="#1AB394">
              <el-radio-button v-for="(item,key) in options" :key="key" :label="item.label"></el-radio-button>
            </el-radio-group>
          </label>
          <el-date-picker
            v-model="chooseDate"
            :type="dateType"
            :format="format"
            :clearable="false"
            :editable="false"
            :picker-options="{firstDayOfWeek:1}" 
            :placeholder="title" @change='changeTime'>
          </el-date-picker>
          <label style="margin-left:20px">业绩：
            <el-select v-model="sourceValue1" placeholder="请选择"  @change="handleCommand">
              <el-option label="总业绩排行" :value="0"></el-option>
              <el-option label="售卡业绩排行" :value="1"></el-option>
              <el-option label="私教课业绩排行" :value="2"></el-option>
              <el-option label="团课业绩排行" :value="3"></el-option>
              <el-option label="购物业绩排行" :value="4"></el-option>
            </el-select>  
          </label>
        </div>
        <div class="achievement-box">
          <rectbox :data="grouplist"></rectbox>
        </div>
        <el-table @sort-change="sortChange" stripe :key='tableKey' :data="tableList?tableList.slice((listQuery.page-1)*listQuery.per_page,listQuery.page*listQuery.per_page):tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
          style="width: 100%;">
          <el-table-column align="center" :label="'序号'" type="index" width="50">
            <template slot-scope="scope">
              <span>{{(scope.$index + 1)  +  (listQuery.page-1)*listQuery.per_page}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'员工姓名'" width="250" prop="scope.row.name">
            <template slot-scope="scope">
              <span>{{scope.row.employee.name}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'手机号码'" prop="scope.row.phone">
            <template slot-scope="scope">
              <span>{{scope.row.employee.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'团课业绩'" sortable prop="scope.row.phone">
            <template slot-scope="scope">
              <span>{{scope.row.group_course_sale}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'售出团课'" sortable prop="scope.row.phone">
            <template slot-scope="scope">
              <span>{{scope.row.group_course_count}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'完成团课'" sortable prop="scope.row.phone">
            <template slot-scope="scope">
              <span>{{scope.row.complete_group_course_count}}</span>
            </template>
          </el-table-column>
          <el-table-column width="250px" align="center" :label="'待评价团课'" sortable prop="scope.row.phone">
            <template slot-scope="scope">
              <span>{{scope.row.commenting_group_course_count}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'评价'" sortable min-width="230" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <span>{{scope.row.comment_group_course_star}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container" style="text-align:right">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
            :page-sizes="[10,20,30, 50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </el-dialog> -->

    <!-- 购物业绩 -->
    <!-- <el-dialog
      title="购物业绩"
      :visible.sync="shopVisible"
      width="80%" class="statistics-dialog" @close="addclose">
      <div class="contian">
        <div class="selecter">
          <label>
            时间：
            <el-radio-group v-model="dateMode" @change="radioGroupChage" fill="#1AB394"
            >
              <el-radio-button v-for="(item,key) in options" :key="key" :label="item.label"></el-radio-button>
            </el-radio-group>
          </label>
          <el-date-picker
            v-model="chooseDate"
            :type="dateType"
            :format="format"
            :clearable="false"
            :editable="false"
            :picker-options="{firstDayOfWeek:1}" 
            :placeholder="title" @change='changeTime'>
          </el-date-picker>
          <label style="margin-left:20px">业绩：
            <el-select v-model="sourceValue1" placeholder="请选择"  @change="handleCommand">
              <el-option label="总业绩排行" :value="0"></el-option>
              <el-option label="售卡业绩排行" :value="1"></el-option>
              <el-option label="私教课业绩排行" :value="2"></el-option>
              <el-option label="团课业绩排行" :value="3"></el-option>
              <el-option label="购物业绩排行" :value="4"></el-option>
            </el-select>  
          </label>
        </div>
        <div class="achievement-box" style="display:block;overflow:hidden;">
          <rectbox :data="shoplist"></rectbox>
        </div>
        <div style="display:block;">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-table @sort-change="sortChange" stripe :key='tableKey' :data="tableList?tableList.slice((listQuery.page-1)*listQuery.per_page,listQuery.page*listQuery.per_page):tableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
          style="width: 100%;">
              <el-table-column align="center" :label="'序号'" type="index" width="50">
                <template slot-scope="scope">
                  <span>{{(scope.$index + 1)  +  (listQuery.page-1)*listQuery.per_page}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="'员工姓名'" width="150" prop="name">
                <template slot-scope="scope">
                  <span>{{scope.row.employee?scope.row.employee.name:'-'}}</span>
                </template>
              </el-table-column>
              <el-table-column width="150px" align="center" :label="'手机号码'" prop="sales">
                <template slot-scope="scope">
                  <span>{{scope.row.employee?scope.row.employee.phone:'-'}}</span>
                </template>
              </el-table-column>
              <el-table-column width="120px" align="center" :label="'购物业绩'" sortable prop="total_sale">
                <template slot-scope="scope">
                  <span>{{scope.row.goods_sale}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="'销售利润'" sortable min-width="120" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <span>暂无</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-container">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                :page-sizes="[10,20,30, 50]" :page-size="listQuery.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-table @sort-change="sortShopChange" stripe :key='tableKey' :data="shopTableList?shopTableList.slice((listQueryShop.page-1)*listQueryShop.per_page,listQueryShop.page*listQueryShop.per_page):shopTableList" v-loading="listLoading" element-loading-text="列表正在加载中" border fit highlight-current-row
          style="width: 100%;">
              <el-table-column align="center" :label="'序号'" type="index" width="50">
                <template slot-scope="scope">
                  <span>{{(scope.$index + 1)  +  (listQueryShop.page-1)*listQueryShop.per_page}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="'商品名'" width="160" prop="name">
                <template slot-scope="scope">
                  <span>{{scope.row.goods?scope.row.goods.name:'-'}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100px" align="center" :label="'售出数量'" prop="sales">
                <template slot-scope="scope">
                  <span>{{scope.row.goods?scope.row.goods.sales:'-'}}</span>
                </template>
              </el-table-column>
              <el-table-column width="120px" align="center" :label="'合计金额'" sortable prop="total_sale">
                <template slot-scope="scope">
                  <span>{{scope.row.total_sale}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="'销售利润'" sortable min-width="120" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <span>暂无</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-container">
              <el-pagination background @size-change="handleSizeShopChange" @current-change="handleCurrentShopChange" :current-page.sync="listQueryShop.page"
                :page-sizes="[10,20,30, 50]" :page-size="listQueryShop.per_page" layout="total, sizes, prev, pager, next, jumper" :total="totalShop">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
        </div>
      </div>
    </el-dialog> -->

  </div>
</template>

<script>
import { statisticsData, dayIncomeData, weekIncomeData, monthIncomeData, yearIncomeData } from '@/api/statistics'
import { salesPerformance } from '@/api/statistics'
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import RecordTable from './components/recordTable'
import rectbox from './components/reacBox'
import { parseTime } from '@/utils/index'
let lineChartData = {
  lineVisitis: {
    oldData: [],
    newData: []
  },
  titleData: ['昨天', '新增收入'],
  dateTime: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
}
const pieChartData = {
  titleData: ['售卡', '转卡', '续卡', '停卡', '私教', '团课', '购物', '租柜'],
  data: [
    { value: 0, name: '售卡' },
    { value: 0, name: '转卡' },
    { value: 0, name: '续卡' },
    { value: 0, name: '停卡' },
    { value: 0, name: '私教' },
    { value: 0, name: '团课' },
    { value: 0, name: '购物' },
    { value: 0, name: '租柜' }
  ]
}
let xzsr = [
  {
    name: '售卡',
    type: 'bar',
    stack: 'vistors',
    barWidth: '60%',
    data: [],
    animationDuration: 6000
  },
  {
    name: '转卡',
    type: 'bar',
    stack: 'vistors',
    barWidth: '60%',
    data: [],
    animationDuration: 6000
  },
  {
    name: '续卡',
    type: 'bar',
    stack: 'vistors',
    barWidth: '60%',
    data: [],
    animationDuration: 6000
  },
  {
    name: '停卡',
    type: 'bar',
    stack: 'vistors',
    barWidth: '60%',
    data: [],
    animationDuration: 6000
  }, {
    name: '私教',
    type: 'bar',
    stack: 'vistors',
    barWidth: '60%',
    data: [],
    animationDuration: 6000
  }, {
    name: '团课',
    type: 'bar',
    stack: 'vistors',
    barWidth: '60%',
    data: [],
    animationDuration: 6000
  }, {
    name: '购物',
    type: 'bar',
    stack: 'vistors',
    barWidth: '60%',
    data: [],
    animationDuration: 6000
  }, {
    name: '租柜',
    type: 'bar',
    stack: 'vistors',
    barWidth: '60%',
    data: [],
    animationDuration: 6000
  }
]
const barChartData = {
  dateTime: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
  data: xzsr
}

export default {
  name: 'dashboard-admin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    PieChart,
    BarChart,
    TransactionTable,
    RecordTable,
    rectbox
  },
  data() {
    return {
      oldDate: [],
      newDate: [],
      currentType: 'income',
      dropdownTitle: '总业绩排行',
      lineChartData: lineChartData,
      pieChartData: pieChartData,
      barChartData: barChartData,
      tableTitle: '总业绩排名',
      shopTableList: null,
      transactionThead: [parseTime(new Date(), '{y}-{m}-{d}'), '前一天'],
      transactionTable: [{
        name: '会员数量',
        total: 0,
        week: 0,
        lastWeek: 0
      }, {
        name: '潜客数量',
        total: 0,
        week: 0,
        lastWeek: 0
      }, {
        name: '签到数量',
        total: 0,
        week: 0,
        lastWeek: 0
      }, {
        name: '售卡数量',
        total: 0,
        week: 0,
        lastWeek: 0
      }, {
        name: '售卡金额',
        total: 0,
        week: 0,
        float: true,
        lastWeek: 0
      }, {
        name: '私教课售出数量',
        total: 0,
        week: 0,
        lastWeek: 0
      }, {
        name: '私教课售出金额',
        total: 0,
        week: 0,
        float: true,
        lastWeek: 0
      }, {
        name: '团课售出数量',
        total: 0,
        week: 0,
        lastWeek: 0
      }, {
        name: '团课售出金额',
        total: 0,
        week: 0,
        float: true,
        lastWeek: 0
      }],
      options: [{
        value: 1,
        label: '日统计'
      }, {
        value: 2,
        label: '周统计'
      }, {
        value: 3,
        label: '月统计'
      }, {
        value: 4,
        label: '年统计'
      }],
      dateMode: '日统计', // 日期方式
      value: '日统计',
      openvalue: '日统计',
      dateType: 'date',
      chooseDate: new Date(),
      chooseOpenDate: new Date(),
      format: '',
      title: '请选择日期',
      panelValue: {
        income: 0,
        opencard: 0,
        customer: 0,
        signIn: 0
      },
      // opendateType: 'date',
      // openformat: '',
      // opentitle: '请选择日期',
      // openVisible: false,
      // date_type: '',
      // totalVisible: false,
      // privateVisible: false,
      // groupVisible: false,
      // shopVisible: false,
      // otherVisible: false,
      // dialogType: 0,
      // totalRextlist: [{
      //   text: '总业绩',
      //   num: 0,
      //   checked: false,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '售卡业绩',
      //   num: 0,
      //   checked: false,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '私教课业绩',
      //   num: 0,
      //   checked: false,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '团课业绩',
      //   num: 0,
      //   checked: false,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '购物业绩',
      //   num: 0,
      //   checked: false,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '其他业绩',
      //   num: 0,
      //   checked: false,
      //   bocolor: 'rgb(231, 234, 236)'
      // }],
      // openCardlist: [{
      //   text: '售卡业绩',
      //   num: 0,
      //   checked: false,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '潜客录入',
      //   num: 0,
      //   checked: false,
      //   int: true,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '售卡数量',
      //   num: 0,
      //   checked: false,
      //   int: true,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '售卡人数',
      //   num: 0,
      //   checked: false,
      //   int: true,
      //   bocolor: 'rgb(231, 234, 236)'
      // }],
      // privatelist: [{
      //   text: '私教课业绩',
      //   num: 0,
      //   checked: false,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '售出私教课',
      //   num: 0,
      //   checked: false,
      //   int: true,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '完成私教课',
      //   num: 0,
      //   checked: false,
      //   int: true,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '待评价私教课',
      //   num: 0,
      //   checked: false,
      //   int: true,
      //   bocolor: 'rgb(231, 234, 236)'
      // }],
      // grouplist: [{
      //   text: '团课业绩',
      //   num: 0,
      //   checked: false,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '售出团课',
      //   num: 0,
      //   checked: false,
      //   int: true,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '完成团课',
      //   num: 0,
      //   checked: false,
      //   int: true,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '待评价团课',
      //   num: 0,
      //   checked: false,
      //   int: true,
      //   bocolor: 'rgb(231, 234, 236)'
      // }],
      // shoplist: [{
      //   text: '购物业绩',
      //   num: 0,
      //   checked: false,
      //   bocolor: 'rgb(231, 234, 236)'
      // }, {
      //   text: '销售利润',
      //   num: 0,
      //   checked: false,
      //   bocolor: 'rgb(231, 234, 236)'
      // }],
      myData: '',
      totalTableList: [],
      totalTableArray: [],
      listLoading: false,
      tableKey: 1,
      total: null,
      totalShop: null,
      listQuery: {
        page: 1,
        per_page: 10,
        column: 'day',
        value: parseTime(new Date(), '{y}-{m}-{d}')
      },
      listQueryShop: {
        page: 1,
        per_page: 10,
        column: 'day',
        value: parseTime(new Date(), '{y}-{m}-{d}')
      },
      listDate: {
        date_egt: parseTime(new Date(), '{y}-{m}-{d}'),
        date_lt: parseTime(new Date(new Date().getTime() + 86400000), '{y}-{m}-{d}')
        // column: 'day',
        // value: parseTime(new Date(), '{y}-{m}-{d}')
      },
      LineDate: {
        column: 'day',
        value: [parseTime(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')]
      },
      lineTitle: '新增收入',
      LineIncome: {
        oldData: [],
        newData: []
      },
      LineCardNum: {
        oldData: [],
        newData: []
      },
      LineCustomer: {
        oldData: [],
        newData: []
      },
      LineSignIn: {
        oldData: [],
        newData: []
      },
      pieIncome: {
        titleData: '',
        data: [
          { value: 0, name: '售卡' },
          { value: 0, name: '转卡' },
          { value: 0, name: '续卡' },
          { value: 0, name: '停卡' },
          { value: 0, name: '私教' },
          { value: 0, name: '团课' },
          { value: 0, name: '购物' },
          { value: 0, name: '租柜' }
        ]
      },
      pieCardNum: {
        titleData: '',
        data: [
          { value: 0, name: '男会员' },
          { value: 0, name: '女会员' }
        ]
      },
      pieCustomer: {
        titleData: '',
        data: [
          { value: 0, name: '男潜客' },
          { value: 0, name: '女潜客' }
        ]
      },
      pieSignIn: {
        titleData: '',
        data: [
          { value: 0, name: '男会员' },
          { value: 0, name: '女会员' },
          { value: 0, name: '男潜客' },
          { value: 0, name: '女潜客' }
        ]
      },
      barChartIncome: xzsr,
      barChartCardNum: [
        {
          name: '男会员',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [],
          animationDuration: 6000
        }, {
          name: '女会员',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [],
          animationDuration: 6000
        }
      ],
      barChartCustomer: [
        {
          name: '男潜客',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [],
          animationDuration: 6000
        }, {
          name: '女潜客',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [],
          animationDuration: 6000
        }
      ],
      barChartSignIn: [
        {
          name: '男会员',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [],
          animationDuration: 6000
        }, {
          name: '女会员',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [],
          animationDuration: 6000
        }, {
          name: '男潜客',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [],
          animationDuration: 6000
        }, {
          name: '女潜客',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [],
          animationDuration: 6000
        }
      ],
      tableList: null,
      sourceIncome: [{ // 来源渠道
        label: '新增收入',
        type: 'income'
      }, {
        label: '新增会员',
        type: 'cardNum'
      }, {
        label: '新增潜客',
        type: 'customer'
      }, {
        label: '新增签到',
        type: 'signIn'
      }],
      sourceValue: 'income', // 当前选中的来源
      paramsData: {
        group: 'day',
        type: '0'
      }
      // sourceValue1: 0
    }
  },
  computed: {
  },
  created() {
    this.__init()
  },
  mounted() {
  },
  methods: {
    getType(map) {
      let MAP = {}
      return function(type) {
        return MAP[type] != null ? MAP[type] : (function() {
          for (let names in map) {
            let namesArray = names.split('|')
            for (let i = 0, length = namesArray.length; i < length; i++) {
              MAP[namesArray[i]] = map[names]
            }
          }
          return MAP[type] != null ? MAP[type] : ''
        })()
      }
    },
    __init() {
      this.getLineDate()
      this.getTotalTable('total_sale')
      this.getIncomDateByDay()
    },
    sortChange(data) {
      delete this.listQuery[this.deleteItemSort]
      this.deleteItemSort = data.prop
      this.listQuery[data.prop] = data.order
      this.listQuery.page = 1
      // this.getTotalList()
    },
    sortShopChange(data) {
      delete this.listQueryShop[this.deleteItemSort]
      this.deleteItemSort = data.prop
      this.listQueryShop[data.prop] = data.order
      this.listQueryShop.page = 1
      // this.shopSale()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
    },
    handleSizeChange(val) {
      this.listQuery.per_page = val
    },
    handleCurrentShopChange(val) {
      this.listQueryShop.page = val
    },
    handleSizeShopChange(val) {
      this.listQueryShop.per_page = val
    },
    // 日期方式
    changeType(value) {
      let nowMonth = parseTime(this.chooseDate, '{y}-{m}').split('-')[1]
      let nowYear = parseTime(this.chooseDate, '{y}-{m}').split('-')[0]
      let week = new Date(this.chooseDate).getDay()
      switch (value) {
        case 1: {
          this.dateType = 'date'
          this.format = 'yyyy 年 MM 月 dd 日'
          this.title = '请选择日期'
          // 折线图参数value，前一天，今天日期
          this.LineDate.column = 'day'
          this.LineDate.value = [parseTime(new Date(this.chooseDate.getTime() - 24 * 60 * 60 * 1000), '{y}-{m}-{d}'), parseTime(this.chooseDate, '{y}-{m}-{d}')]
          // 折线图所需数据
          lineChartData.titleData = ['昨天', this.lineTitle]
          lineChartData.dateTime = ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
          // 柱形图横坐标
          barChartData.dateTime = ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
          // table表头
          this.transactionThead = [parseTime(this.chooseDate, '{y}-{m}-{d}'), '前一天']
          // 总业绩排行所需数据
          // this.listDate.column = 'day'
          // this.listDate.value = parseTime(this.chooseDate, '{y}-{m}-{d}')
          this.listDate.date_egt = parseTime(new Date(this.chooseDate), '{y}-{m}-{d}')
          this.listDate.date_lt = parseTime(new Date(new Date(this.chooseDate).getTime() + 86400000), '{y}-{m}-{d}')
          this.listQuery.column = 'day'
          this.listQuery.value = parseTime(this.chooseDate, '{y}-{m}-{d}')
          this.listQueryShop.column = 'day'
          this.listQueryShop.value = parseTime(this.chooseDate, '{y}-{m}-{d}')
          this.getIncomDateByDay()
          break
        }
        case 2: {
          this.dateType = 'week'
          this.format = 'yyyy 第 WW 周'
          this.title = '选择周'
          let weekofyear = ((this.chooseDate - (new Date(this.chooseDate.getFullYear(), 0, 1))) / (24 * 60 * 60 * 7 * 1000) | 0) + 1
          let date = parseTime(this.chooseDate, '{y}') + '-' + weekofyear
          this.LineDate.column = 'weekOfYear'
          let year = weekofyear > 1 ? parseTime(this.chooseDate, '{y}') : parseTime(this.chooseDate, '{y}') - 1
          let prevWeek = weekofyear > 1 ? weekofyear - 1 : 52
          this.LineDate.value = [year + '-' + prevWeek, date]
          lineChartData.titleData = ['上周', this.lineTitle]
          lineChartData.dateTime = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
          barChartData.dateTime = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
          this.transactionThead = [parseTime(this.chooseDate, '{y}') + '年第' + weekofyear + '周', '前一周']
          // 总业绩排行所需数据
          // this.listDate.column = 'weekOfYear'
          // this.listDate.value = date
          this.listDate.date_egt = parseTime(new Date(this.chooseDate) - (week - 1) * 86400000, '{y}-{m}-{d}')
          this.listDate.date_lt = parseTime(new Date(new Date(this.chooseDate).getTime() + (7 - week + 1) * 86400000), '{y}-{m}-{d}')
          this.listQuery.column = 'weekOfYear'
          this.listQuery.value = date
          this.listQueryShop.column = 'weekOfYear'
          this.listQueryShop.value = date
          this.getIncomDateByWeek()
          break
        }
        case 3: {
          this.dateType = 'month'
          this.format = 'yyyy 年 MM 月'
          this.title = '选择月'
          let month = parseTime(this.chooseDate, '{y}-{m}').split('-')[1] > 1 ? parseTime(this.chooseDate, '{y}-{m}').split('-')[1] - 1 : 12
          let prevmonth = month > 10 ? month : '0' + month
          let prevyear = parseTime(this.chooseDate, '{y}-{m}').split('-')[1] > 1 ? parseTime(this.chooseDate, '{y}-{m}').split('-')[0] : parseTime(this.chooseDate, '{y}-{m}').split('-')[0] - 1
          this.LineDate.column = 'month'
          this.LineDate.value = [prevyear + '-' + prevmonth, parseTime(this.chooseDate, '{y}-{m}')]
          lineChartData.titleData = ['上月', this.lineTitle]
          lineChartData.dateTime = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
          barChartData.dateTime = this.mGetDate(parseTime(this.chooseDate, '{y}'), parseTime(this.chooseDate, '{y}-{m}').split('-')[1])
          this.transactionThead = [parseTime(this.chooseDate, '{y}-{m}'), '上月']
          // 总业绩排行所需数据
          // this.listDate.column = 'month'
          // this.listDate.value = parseTime(this.chooseDate, '{y}-{m}')
          this.listDate.date_egt = nowYear + '-' + nowMonth + '-01'
          if (Number(nowMonth) === 12) {
            this.listDate.date_lt = (nowYear + 1) + '-' + '01-01'
          } else {
            this.listDate.date_lt = nowYear + '-' + (nowMonth > 9 ? Number(nowMonth) + 1 : nowMonth) + '-01'
          }
          this.listQuery.column = 'month'
          this.listQuery.value = parseTime(this.chooseDate, '{y}-{m}')
          this.listQueryShop.column = 'month'
          this.listQueryShop.value = parseTime(this.chooseDate, '{y}-{m}')
          this.getIncomDateByMonth()
          break
        }
        case 4:
          this.dateType = 'year'
          this.format = 'yyyy 年'
          this.title = '选择年'
          this.LineDate.column = 'year'
          this.LineDate.value = [parseTime(this.chooseDate, '{y}') - 1, parseTime(this.chooseDate, '{y}')]
          lineChartData.titleData = ['上一年', this.lineTitle]
          lineChartData.dateTime = ['1月', '2月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          barChartData.dateTime = ['1月', '2月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          this.transactionThead = [parseTime(this.chooseDate, '{y}'), '去年']
          // 总业绩排行所需数据
          // this.listDate.column = 'year'
          // this.listDate.value = parseTime(this.chooseDate, '{y}')
          this.listDate.date_egt = nowYear + '-' + '01-01'
          this.listDate.date_lt = (Number(nowYear) + 1) + '-' + '01-01'
          this.listQuery.column = 'year'
          this.listQuery.value = parseTime(this.chooseDate, '{y}')
          this.listQueryShop.column = 'year'
          this.listQueryShop.value = parseTime(this.chooseDate, '{y}')
          this.getIncomDateByYear()
          break
      }
      this.getLineDate()
      this.getTotalTable()
      // this.changeYjOrder()
      // this.getTotalList()
      // if (this.dialogType === 4) {
      //   this.shopSale()
      // }
    },
    // 日期选择 单选组
    radioGroupChage(value) {
      let obj = this.options.filter(item => {
        return item.label === value
      })
      this.changeType(obj[0].value)
    },
    // 获得不同月份的天数
    mGetDate(year, month) {
      let d = new Date(year, month, 0)
      let day = parseInt(d.getDate())
      let dayArray = []
      for (let i = 0; i < day; i++) {
        dayArray[i] = i + 1
      }
      return dayArray
    },
    // 下拉渠道
    sourceChange(value) {
      this.$refs.panelGroup.handleSetLineChartData(value)
    },
    // 首页时间改变,获得对应日期格式
    changeTime(value) {
      let nowMonth = parseTime(value, '{y}-{m}').split('-')[1]
      let nowYear = parseTime(value, '{y}-{m}').split('-')[0]
      let week = new Date(value).getDay()
      if (this.dateType === 'date') {
        // 总业绩排行所需数据
        this.listDate.date_egt = parseTime(new Date(value), '{y}-{m}-{d}')
        this.listDate.date_lt = parseTime(new Date(new Date(value).getTime() + 86400000), '{y}-{m}-{d}')
        // this.listDate.value = parseTime(this.chooseDate, '{y}-{m}-{d}')
        this.listQuery.value = parseTime(this.chooseDate, '{y}-{m}-{d}')
        this.listQueryShop.value = parseTime(this.chooseDate, '{y}-{m}-{d}')
        this.LineDate.value = [parseTime(new Date(this.chooseDate.getTime() - 24 * 60 * 60 * 1000), '{y}-{m}-{d}'), parseTime(this.chooseDate, '{y}-{m}-{d}')]
        // table表头
        this.transactionThead = [parseTime(this.chooseDate, '{y}-{m}-{d}'), '前一天']
        this.getIncomDateByDay()
      } else if (this.dateType === 'week') {
        let weekofyear = ((this.chooseDate - (new Date(this.chooseDate.getFullYear(), 0, 1))) / (24 * 60 * 60 * 7 * 1000) | 0) + 1
        let date = parseTime(this.chooseDate, '{y}') + '-' + weekofyear
        // 总业绩排行所需数据
        // this.listDate.value = date
        // this.listQuery.value = date
        this.listDate.date_egt = parseTime(new Date(value) - (week - 1) * 86400000, '{y}-{m}-{d}')
        this.listDate.date_lt = parseTime(new Date(new Date(value).getTime() + (7 - week + 1) * 86400000), '{y}-{m}-{d}')
        this.listQueryShop.value = date
        let prevyear = weekofyear > 1 ? parseTime(this.chooseDate, '{y}') : parseTime(this.chooseDate, '{y}') - 1
        let prevWeek = weekofyear > 1 ? weekofyear - 1 : 52
        this.LineDate.value = [prevyear + '-' + prevWeek, date]
        // table表头
        this.transactionThead = [parseTime(this.chooseDate, '{y}') + '年第' + weekofyear + '周', '前一周']
        this.getIncomDateByWeek()
      } else if (this.dateType === 'month') {
        // 总业绩排行所需数据
        // this.listDate.value = parseTime(this.chooseDate, '{y}-{m}')
        this.listDate.date_egt = nowYear + '-' + nowMonth + '-01'
        if (Number(nowMonth) === 12) {
          this.listDate.date_lt = (nowYear + 1) + '-' + '01-01'
        } else {
          this.listDate.date_lt = nowYear + '-' + (nowMonth > 9 ? Number(nowMonth) + 1 : nowMonth) + '-01'
        }
        this.listQuery.value = parseTime(this.chooseDate, '{y}-{m}')
        this.listQueryShop.value = parseTime(this.chooseDate, '{y}-{m}')
        let month = parseTime(this.chooseDate, '{y}-{m}').split('-')[1] > 1 ? parseTime(this.chooseDate, '{y}-{m}').split('-')[1] - 1 : 12
        let prevmonth = month > 10 ? month : '0' + month
        let prevyear = parseTime(this.chooseDate, '{y}-{m}').split('-')[1] > 1 ? parseTime(this.chooseDate, '{y}-{m}').split('-')[0] : parseTime(this.chooseDate, '{y}-{m}').split('-')[0] - 1
        this.LineDate.value = [prevyear + '-' + prevmonth, parseTime(this.chooseDate, '{y}-{m}')]
        barChartData.dateTime = this.mGetDate(parseTime(this.chooseDate, '{y}'), parseTime(this.chooseDate, '{y}-{m}').split('-')[1])
        // table表头
        this.transactionThead = [parseTime(this.chooseDate, '{y}-{m}'), '上月']
        this.getIncomDateByMonth()
      } else if (this.dateType === 'year') {
        // 总业绩排行所需数据
        // this.listDate.value = parseTime(this.chooseDate, '{y}')
        this.listDate.date_egt = nowYear + '-' + '01-01'
        this.listDate.date_lt = (Number(nowYear) + 1) + '-' + '01-01'
        this.listQuery.value = parseTime(this.chooseDate, '{y}')
        this.listQueryShop.value = parseTime(this.chooseDate, '{y}')
        this.LineDate.value = [parseTime(this.chooseDate, '{y}') - 1, parseTime(this.chooseDate, '{y}')]
        // table表头
        this.transactionThead = [parseTime(this.chooseDate, '{y}'), '去年']
        this.getIncomDateByYear()
      }
      this.getLineDate()
      this.getTotalTable()
      // this.changeYjOrder()
      // this.getTotalList()
    },
    addclose() {
    },
    resetData() {
      // 折线图
      // lineChartData.lineVisitis.oldData = []
      // lineChartData.lineVisitis.newData = []
      // 新增收入
      // this.LineIncome.oldData = []
      // this.LineIncome.newData = []
      // 新增售卡
      this.LineCardNum.oldData = []
      this.LineCardNum.newData = []
      // 新增潜客
      this.LineCustomer.oldData = []
      this.LineCustomer.newData = []
      // 新增签到
      this.LineSignIn.oldData = []
      this.LineSignIn.newData = []
    },
    // 首页获得数据
    getLineDate() {
      statisticsData(this.LineDate).then(response => {
        this.resetData()
        if (response.data.data) {
          let index1 = this.LineDate.value[0]
          let index2 = this.LineDate.value[1]
          let len1 = Object.keys(response.data.data[index1]).length
          let len2 = Object.keys(response.data.data[index2]).length
          for (let i = 0; i < len1; i++) {
            // this.LineCardNum.oldData[i] = parseInt(response.data.data[index1][i + 1].card_count)
            this.LineCardNum.oldData[i] = parseInt(response.data.data[index1][i + 1].vip_man_count) + parseInt(response.data.data[index1][i + 1].vip_woman_count)
            this.LineCustomer.oldData[i] = parseInt(response.data.data[index1][i + 1].pc_man_count) + parseInt(response.data.data[index1][i + 1].pc_woman_count)
            this.LineSignIn.oldData[i] = parseInt(response.data.data[index1][i + 1].pc_man_sign_count) + parseInt(response.data.data[index1][i + 1].pc_woman_sign_count) + parseInt(response.data.data[index1][i + 1].vip_man_sign_count) + parseInt(response.data.data[index1][i + 1].vip_woman_sign_count)
          }
          for (let i = 0; i < len2; i++) {
            // 新增会员折线图
            this.LineCardNum.newData[i] = parseInt(response.data.data[index2][i + 1].vip_man_count) + parseInt(response.data.data[index2][i + 1].vip_woman_count)
            // 新增潜客折线图
            this.LineCustomer.newData[i] = parseInt(response.data.data[index2][i + 1].pc_man_count) + parseInt(response.data.data[index2][i + 1].pc_woman_count)
            // 新增签到折线图
            this.LineSignIn.newData[i] = parseInt(response.data.data[index2][i + 1].pc_man_sign_count) + parseInt(response.data.data[index2][i + 1].pc_woman_sign_count) + parseInt(response.data.data[index2][i + 1].vip_man_sign_count) + parseInt(response.data.data[index2][i + 1].vip_woman_sign_count)
            // 新增售卡柱形图
            this.barChartCardNum[0].data[i] = response.data.data[index2][i + 1].vip_man_count // 男会员
            this.barChartCardNum[1].data[i] = response.data.data[index2][i + 1].vip_woman_count // 女会员
            // 新增潜客柱形图
            this.barChartCustomer[0].data[i] = response.data.data[index2][i + 1].pc_man_count // 男潜客
            this.barChartCustomer[1].data[i] = response.data.data[index2][i + 1].pc_woman_count // 女潜客
            // 新增签到柱形图
            this.barChartSignIn[0].data[i] = response.data.data[index2][i + 1].vip_man_sign_count // 男会员
            this.barChartSignIn[1].data[i] = response.data.data[index2][i + 1].vip_woman_sign_count // 女会员
            this.barChartSignIn[2].data[i] = response.data.data[index2][i + 1].pc_man_sign_count // 男潜客
            this.barChartSignIn[3].data[i] = response.data.data[index2][i + 1].pc_woman_sign_count // 女潜客
          }
          // this.handleSetLineChartData(this.currentType)
        }
        if (response.data.data_total !== undefined) {
          let index1 = this.LineDate.value[0]
          let index2 = this.LineDate.value[1]
          this.panelValue.opencard = parseFloat(response.data.data_total[index2].vip_man_count) + parseFloat(response.data.data_total[index2].vip_woman_count)
          this.panelValue.customer = parseFloat(response.data.data_total[index2].pc_man_count) + parseFloat(response.data.data_total[index2].pc_woman_count)
          this.panelValue.signIn = parseInt(response.data.data_total[index2].pc_man_sign_count) + parseInt(response.data.data_total[index2].pc_woman_sign_count) + parseInt(response.data.data_total[index2].vip_man_sign_count) + parseInt(response.data.data_total[index2].vip_woman_sign_count)
          // 饼状图
          pieChartData.data[4].value = parseFloat(response.data.data_total[index2].card_transfer_total_fee) + parseFloat(response.data.data_total[index2].card_stop_total_fee)
          // 新增会员饼状图
          this.pieCardNum.data[0].value = response.data.data_total[index2].vip_man_count
          this.pieCardNum.data[1].value = response.data.data_total[index2].vip_woman_count
          // 新增潜客饼状图
          this.pieCustomer.data[0].value = response.data.data_total[index2].pc_man_count
          this.pieCustomer.data[1].value = response.data.data_total[index2].pc_woman_count
          // 新增签到饼状图
          this.pieSignIn.data[0].value = response.data.data_total[index2].vip_man_sign_count
          this.pieSignIn.data[1].value = response.data.data_total[index2].vip_woman_sign_count
          this.pieSignIn.data[2].value = response.data.data_total[index2].pc_man_sign_count
          this.pieSignIn.data[3].value = response.data.data_total[index2].pc_woman_sign_count
          // 会员数量
          this.transactionTable[0].lastWeek = response.data.data_total[index1].vip_man_count + response.data.data_total[index1].vip_woman_count
          this.transactionTable[0].week = response.data.data_total[index2].vip_man_count + response.data.data_total[index2].vip_woman_count
          this.transactionTable[0].total = this.transactionTable[0].lastWeek + this.transactionTable[0].week
          // 潜客数量
          this.transactionTable[1].lastWeek = response.data.data_total[index1].pc_man_count + response.data.data_total[index1].pc_woman_count
          this.transactionTable[1].week = response.data.data_total[index2].pc_man_count + response.data.data_total[index2].pc_woman_count
          this.transactionTable[1].total = this.transactionTable[1].lastWeek + this.transactionTable[1].week
          // 签到数量
          this.transactionTable[2].lastWeek = response.data.data_total[index1].pc_man_sign_count + response.data.data_total[index1].pc_woman_sign_count + response.data.data_total[index1].vip_man_sign_count + response.data.data_total[index1].vip_woman_sign_count
          this.transactionTable[2].week = response.data.data_total[index2].pc_man_sign_count + response.data.data_total[index2].pc_woman_sign_count + response.data.data_total[index2].vip_man_sign_count + response.data.data_total[index2].vip_woman_sign_count
          this.transactionTable[2].total = this.transactionTable[2].lastWeek + this.transactionTable[2].week
          // 售卡数量
          this.transactionTable[3].lastWeek = response.data.data_total[index1].net_card_count
          this.transactionTable[3].week = response.data.data_total[index2].net_card_count
          this.transactionTable[3].total = this.transactionTable[3].lastWeek + this.transactionTable[3].week
          // 售卡金额
          this.transactionTable[4].lastWeek = response.data.data_total[index1].net_card_total_fee
          this.transactionTable[4].week = response.data.data_total[index2].net_card_total_fee
          this.transactionTable[4].total = this.transactionTable[4].lastWeek + this.transactionTable[4].week
          // 私教课售出数量
          this.transactionTable[5].lastWeek = response.data.data_total[index1].net_course_count
          this.transactionTable[5].week = response.data.data_total[index2].net_course_count
          this.transactionTable[5].total = this.transactionTable[5].lastWeek + this.transactionTable[5].week
          // 私教课收入
          this.transactionTable[6].lastWeek = response.data.data_total[index1].course_total_fee
          this.transactionTable[6].week = response.data.data_total[index2].course_total_fee
          this.transactionTable[6].total = this.transactionTable[6].lastWeek + this.transactionTable[6].week
          // 团课出售数量
          this.transactionTable[7].lastWeek = response.data.data_total[index1].group_course_count
          this.transactionTable[7].week = response.data.data_total[index2].group_course_count
          this.transactionTable[7].total = this.transactionTable[7].lastWeek + this.transactionTable[7].week
          // 团课收入
          this.transactionTable[8].lastWeek = response.data.data_total[index1].group_course_total_fee
          this.transactionTable[8].week = response.data.data_total[index2].group_course_total_fee
          this.transactionTable[8].total = this.transactionTable[8].lastWeek + this.transactionTable[8].week
        } else {
          this.panelValue.opencard = 0
          this.panelValue.customer = 0
          this.panelValue.signIn = 0
          // 饼状图
          pieChartData.data[0].value = 0
          pieChartData.data[1].value = 0
          pieChartData.data[2].value = 0
          pieChartData.data[3].value = 0
          pieChartData.data[4].value = 0
        }
      })
    },
    // 新增收入
    getIncomeCommon(obj) {
      this.panelValue.income = Number(obj.total)
      // 折线图
      lineChartData.lineVisitis.newData = []
      lineChartData.lineVisitis.oldData = []
      // this.LineIncome.newData = []
      // this.LineIncome.oldData = []
      var len1 = obj.group[0].length
      var len2 = obj.group[1].length
      for (let i = 0; i < len1; i++) { // 新
        lineChartData.lineVisitis.newData[i] = parseFloat(obj.group[0][i].real_total_fee)
        this.LineIncome.newData[i] = parseFloat(obj.group[0][i].real_total_fee)
      }
      for (let i = 0; i < len2; i++) { // 旧
        lineChartData.lineVisitis.oldData[i] = parseFloat(obj.group[1][i].real_total_fee)
        this.LineIncome.oldData[i] = parseFloat(obj.group[1][i].real_total_fee)
      }
      // 饼状图
      pieChartData.data[0].value = obj.typeTotal[2].real_total_fee // 售卡
      pieChartData.data[1].value = obj.typeTotal[4].real_total_fee // 转卡
      pieChartData.data[2].value = obj.typeTotal[7].real_total_fee // 续卡
      pieChartData.data[3].value = obj.typeTotal[5].real_total_fee // 停卡
      pieChartData.data[4].value = obj.typeTotal[3].real_total_fee // 私教
      pieChartData.data[5].value = obj.typeTotal[6].real_total_fee // 团课
      pieChartData.data[6].value = obj.typeTotal[1].real_total_fee // 购物
      pieChartData.data[7].value = this.common.float2(parseFloat(obj.typeTotal[8].real_total_fee) + parseFloat(obj.typeTotal[9].real_total_fee)) // 租柜
      this.pieIncome.data = pieChartData.data
      // 柱形图
      let config = {
        1: 2, 2: 4, 3: 7, 4: 5, 5: 3, 6: 6, 7: 1, 8: [8, 9]
      }
      let getDDD = this.getType(config)
      let clone = {}
      for (let i in obj.typeGroup) {
        if (i < 8) {
          clone[i] = obj.typeGroup[getDDD(i)]
        } else if (i === '8') {
          let arr = []
          let count = 0
          for (let j = 0; j < obj.typeGroup[i].length; j++) {
            count = parseFloat(obj.typeGroup[i][j].real_total_fee) + parseFloat(obj.typeGroup[Number(i) + 1][j].real_total_fee)
            arr.push({ day_hour: obj.typeGroup[i][j].day_hour, hour: obj.typeGroup[i][j].hour, real_total_fee: this.common.float2(count) })
          }
          clone[i] = arr
        }
      }
      for (let i in clone) {
        xzsr[i - 1].data = []
        for (let j = 0; j < clone[i].length; j++) {
          xzsr[i - 1].data.push(clone[i][j].real_total_fee)
        }
      }
    },
    // 收入-日
    getIncomDateByDay() {
      dayIncomeData(this.LineDate.value[1]).then(res => {
        this.getIncomeCommon(res.data)
      })
    },
    // 收入-周
    getIncomDateByWeek() {
      weekIncomeData(this.LineDate.value[1].split('-')[0], this.LineDate.value[1].split('-')[1]).then(res => {
        this.getIncomeCommon(res.data)
      })
    },
    // 收入-月
    getIncomDateByMonth() {
      monthIncomeData(this.LineDate.value[1].split('-')[0], this.LineDate.value[1].split('-')[1]).then(res => {
        this.getIncomeCommon(res.data)
      })
    },
    // 收入-年
    getIncomDateByYear() {
      yearIncomeData(this.LineDate.value[1]).then(res => {
        this.getIncomeCommon(res.data)
      })
    },
    handleSetLineChartData(type) {
      this.currentType = type
      this.sourceValue = type
      // this.barChartData.data = []
      if (type === 'income') {
        // 折线
        this.lineTitle = '新增收入'
        this.lineChartData.lineVisitis = this.LineIncome
        // 饼状
        this.pieIncome.titleData = ['售卡', '转卡', '续卡', '停卡', '私教', '团课', '购物', '租柜']
        this.pieChartData = this.pieIncome
        // 柱形图
        this.barChartData.data = xzsr
      } else if (type === 'cardNum') {
        this.lineTitle = '新增会员'
        // this.getLineDate()
        this.lineChartData.lineVisitis = this.LineCardNum
        // 饼状
        this.pieCardNum.titleData = ['男会员', '女会员']
        this.pieChartData = this.pieCardNum
        // 柱形图
        this.barChartData.data = this.barChartCardNum
      } else if (type === 'customer') {
        this.lineTitle = '新增潜客'
        // this.getLineDate()
        this.lineChartData.lineVisitis = this.LineCustomer
        // 饼状
        this.pieCustomer.titleData = ['男潜客', '女潜客']
        this.pieChartData = this.pieCustomer
        // 柱形图
        this.barChartData.data = this.barChartCustomer
      } else if (type === 'signIn') {
        this.lineTitle = '新增签到'
        // this.getLineDate()
        this.lineChartData.lineVisitis = this.LineSignIn
        // 饼状
        this.pieSignIn.titleData = ['男会员', '女会员', '男潜客', '女潜客']
        this.pieChartData = this.pieSignIn
        // 柱形图
        this.barChartData.data = this.barChartSignIn
      }
      if (this.dateType === 'date') {
        lineChartData.titleData = ['昨天', this.lineTitle]
        barChartData.dateTime = ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
      } else if (this.dateType === 'week') {
        lineChartData.titleData = ['上周', this.lineTitle]
        barChartData.dateTime = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
      } else if (this.dateType === 'month') {
        lineChartData.titleData = ['上月', this.lineTitle]
        barChartData.dateTime = this.mGetDate(parseTime(this.chooseDate, '{y}'), parseTime(this.chooseDate, '{y}-{m}').split('-')[1])
        if (lineChartData.lineVisitis.oldData.length < 31) {
          lineChartData.dateTime = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
        } else {
          lineChartData.dateTime = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
        }
      } else if (this.dateType === 'year') {
        lineChartData.titleData = ['去年', this.lineTitle]
        barChartData.dateTime = ['1月', '2月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      }
    },
    // 总业绩排行
    getTotalTable(typeOrder) {
      this.listLoading = true
      this.totalTableArray = []
      this.totalTableList = []
      salesPerformance(this.listDate).then(res => {
        this.listLoading = false
        for (let i = 0; i < res.data.length; i++) {
          let cardMoney = (Number(res.data[i][2].real_total_fee) + Number(res.data[i][4].real_total_fee) + Number(res.data[i][5].real_total_fee) + Number(res.data[i][7].real_total_fee)).toFixed(2)
          let otherMoney = (Number(res.data[i][8].real_total_fee) + Number(res.data[i][9].real_total_fee) + Number(res.data[i][1].real_total_fee)).toFixed(2)
          let totalMoney = Number(cardMoney) + Number(otherMoney) + Number(res.data[i][3].real_total_fee) + Number(res.data[i][6].real_total_fee)
          this.totalTableArray.push({
            cardTotal: { money: cardMoney, name: res.data[i].employee.name },
            privateCourse: { money: res.data[i][3].real_total_fee, name: res.data[i].employee.name },
            groupCourse: { money: res.data[i][6].real_total_fee, name: res.data[i].employee.name },
            otherTotal: { money: otherMoney, name: res.data[i].employee.name },
            total: { money: totalMoney, name: res.data[i].employee.name }
          })
          this.totalTableList.push({
            name: res.data[i].employee.name,
            money: totalMoney
          })
          this.totalTableList.sort(function(a, b) {
            return parseFloat(b.money) - parseFloat(a.money)
          })
          if (this.totalTableList.length > 10) {
            this.totalTableList = this.totalTableList.slice(0, 10)
          }
        }
      })
    },
    changeTabler(value) {
      // this.dialogType = value
      this.listQuery.page = 1
      if (value === '2,4,5,7') { // 售卡业绩
        this.paramsData.type = 1
        this.tableTitle = '会员卡业绩排名'
        for (let i = 0; i < this.totalTableArray.length; i++) {
          this.$set(this.totalTableList, i, this.totalTableArray[i].cardTotal)
        }
      } else if (parseInt(value) === 3) { // 私教业绩
        this.tableTitle = '私教业绩排名'
        this.paramsData.type = 2
        for (let i = 0; i < this.totalTableArray.length; i++) {
          this.$set(this.totalTableList, i, this.totalTableArray[i].privateCourse)
        }
      } else if (parseInt(value) === 6) { // 团课业绩
        this.tableTitle = '团课业绩排名'
        this.paramsData.type = 3
        for (let i = 0; i < this.totalTableArray.length; i++) {
          this.$set(this.totalTableList, i, this.totalTableArray[i].groupCourse)
        }
      } else if (value === '1,8,9') { // 购物业绩
        this.tableTitle = '其他业绩排名'
        this.paramsData.type = 4
        for (let i = 0; i < this.totalTableArray.length; i++) {
          this.$set(this.totalTableList, i, this.totalTableArray[i].otherTotal)
        }
      } else {
        this.paramsData.type = 0
        this.tableTitle = '总业绩排名'
        for (let i = 0; i < this.totalTableArray.length; i++) {
          this.$set(this.totalTableList, i, this.totalTableArray[i].total)
        }
      }
      this.totalTableList.sort(function(a, b) {
        return parseFloat(b.money) - parseFloat(a.money)
      })
      // if (parseInt(value) === 1) { // 售卡业绩
      //   this.sourceValue1 = 1
      //   this.tableTitle = '售卡业绩排名'
      //   this.getTotalTable('card_sale')
      // } else if (parseInt(value) === 2) { // 私教业绩
      //   this.sourceValue1 = 2
      //   this.tableTitle = '私教业绩排名'
      //   this.getTotalTable('course_sale')
      // } else if (parseInt(value) === 3) { // 团课业绩
      //   this.sourceValue1 = 3
      //   this.tableTitle = '团课业绩排名'
      //   this.getTotalTable('group_course_sale')
      // } else if (parseInt(value) === 4) { // 购物业绩
      //   this.sourceValue1 = 4
      //   this.tableTitle = '购物业绩排名'
      //   this.shopSale()
      //   getStatisticsList(this.listQuery).then(response => {
      //     this.tableList = response.data.details
      //   })
      // } else {
      //   this.sourceValue1 = 0
      //   this.tableTitle = '总业绩排名'
      //   this.getTotalTable('total_sale')
      // }
    },
    // 更多详情
    GoTo() {
      this.paramsData = Object.assign({}, this.listDate, this.paramsData)
      this.paramsData.group = this.dateType
      this.$router.push({ path: '/statistics/employeeAchievement', query: this.paramsData })
    },
    // 切换业绩排名
    // changeYjOrder() {
    //   if (this.dialogType === 0) {
    //     this.getTotalTable('total_sale')
    //   } else if (this.dialogType === 1) {
    //     this.getTotalTable('card_sale')
    //   } else if (this.dialogType === 2) {
    //     this.getTotalTable('course_sale')
    //   } else if (this.dialogType === 3) {
    //     this.getTotalTable('group_course_sale')
    //   } else if (this.dialogType === 4) {
    //     this.getTotalTable('goods_sale')
    //   }
    // },
    // 弹框中的业绩
    // getTotalList() {
    //   this.listLoading = true
    //   getStatisticsList(this.listQuery).then(response => {
    //     this.tableList = response.data.details
    //     this.total = response.data.details.length
    //     this.listLoading = false
    //     if (response.data.total != null) {
    //       if (parseInt(this.dialogType) === 1) {
    //         this.openCardlist[0].num = response.data.total.card_sale
    //         this.openCardlist[1].num = response.data.total.pc_count
    //         this.openCardlist[2].num = response.data.total.card_count
    //         this.openCardlist[3].num = response.data.total.ccobc
    //       } else if (parseInt(this.dialogType) === 2) {
    //         this.privatelist[0].num = response.data.total.course_sale
    //         this.privatelist[1].num = response.data.total.course_count
    //         this.privatelist[2].num = response.data.total.complete_course_count
    //         this.privatelist[3].num = response.data.total.commenting_course_count
    //       } else if (parseInt(this.dialogType) === 3) {
    //         this.grouplist[0].num = response.data.total.group_course_sale
    //         this.grouplist[1].num = response.data.total.group_course_count
    //         this.grouplist[2].num = response.data.total.complete_group_course_count
    //         this.grouplist[3].num = response.data.total.commenting_group_course_count
    //       } else if (parseInt(this.dialogType) === 4) {
    //         this.shoplist[0].num = response.data.total.goods_sale
    //         // 暂无销售利润
    //       } else {
    //         this.totalRextlist[1].num = response.data.total.card_sale
    //         this.totalRextlist[2].num = response.data.total.course_sale
    //         this.totalRextlist[3].num = response.data.total.group_course_sale
    //         this.totalRextlist[4].num = response.data.total.goods_sale
    //         this.totalRextlist[5].num = response.data.total.card_stop_sale + response.data.total.card_transfer_sale
    //         this.totalRextlist[0].num = this.totalRextlist[1].num + this.totalRextlist[2].num + this.totalRextlist[3].num + this.totalRextlist[4].num + this.totalRextlist[5].num
    //       }
    //     }
    //   })
    // },
    // // 购物业绩
    // shopSale() {
    //   this.shoplist[0].num = 0
    //   getShopList(this.listQueryShop).then(response => {
    //     this.shopTableList = response.data
    //     this.totalShop = response.data.length
    //     this.totalTableList.splice(0, this.totalTableList.length)
    //     for (let i = 0; i < response.data.length; i++) {
    //       this.$set(this.totalTableList, i, {
    //         type: response.data[i].total_sale,
    //         name: response.data[i].goods ? response.data[i].goods.name : '-'
    //       })
    //     }
    //     this.totalTableList.sort(function(a, b) {
    //       return parseFloat(b.type) - parseFloat(a.type)
    //     })
    //     if (this.totalTableList.length > 10) {
    //       this.totalTableList = this.totalTableList.slice(0, 10)
    //     }
    //   })
    // },
    // changeMoreList() {
    //   if (parseInt(this.dialogType) === 1) { // 售卡业绩
    //     this.sourceValue1 = 1
    //     this.openVisible = true
    //     this.dropdownTitle = '售卡业绩排行'
    //   } else if (parseInt(this.dialogType) === 2) { // 私教业绩
    //     this.sourceValue1 = 2
    //     this.privateVisible = true
    //     this.dropdownTitle = '私教课业绩排行'
    //   } else if (parseInt(this.dialogType) === 3) { // 团课业绩
    //     this.sourceValue1 = 3
    //     this.groupVisible = true
    //     this.dropdownTitle = '团课业绩排行'
    //   } else if (parseInt(this.dialogType) === 4) { // 购物业绩
    //     this.sourceValue1 = 4
    //     this.shopVisible = true
    //     this.dropdownTitle = '购物业绩排行'
    //   } else {
    //     this.sourceValue1 = 0
    //     this.totalVisible = true
    //     this.dropdownTitle = '总业绩排行'
    //   }
    //   this.getTotalList()
    // },
    // handleCommand(command) {
    //   this.visibleClose()
    //   this.listQuery.page = 1
    //   if (parseInt(command) === 1) {
    //     this.dropdownTitle = '售卡业绩排行'
    //     this.dialogType = 1
    //     this.openVisible = true
    //   } else if (parseInt(command) === 2) {
    //     this.dropdownTitle = '私教课业绩排行'
    //     this.dialogType = 2
    //     this.privateVisible = true
    //   } else if (parseInt(command) === 3) {
    //     this.dropdownTitle = '团课业绩排行'
    //     this.dialogType = 3
    //     this.groupVisible = true
    //   } else if (parseInt(command) === 4) {
    //     this.dropdownTitle = '购物业绩排行'
    //     this.dialogType = 4
    //     this.shopVisible = true
    //   } else if (parseInt(command) === 0) {
    //     this.dropdownTitle = '总业绩排行'
    //     this.dialogType = 0
    //     this.totalVisible = true
    //   }
    //   this.getTotalList()
    // },
    // visibleClose() {
    //   this.totalVisible = false
    //   this.openVisible = false
    //   this.privateVisible = false
    //   this.groupVisible = false
    //   this.shopVisible = false
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: #f0f0f0;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    border: 1px solid #cccccc;
  }
}
.selecter-b {
  // height: 46px;
  // width: 100%;
  line-height: 44px;
  background: #fff;
  // margin-left: -32px;
  // margin-right: -32px;
  padding: 10px 20px;
  border: 1px solid #cccccc;
  label {
    color: #333333;
  }
}
.statistics-dialog {
  label {
    color: #333333;
    font-size: 16px;
  }
}
.panel-group-box {
  background: #fff;
  border: 1px solid #cccccc;
  border-top: none;
  padding: 20px;
  // margin-left: -32px;
  // margin-right: -32px;
  margin-bottom: 30px;
}
.statistics-dialog {
  .selecter {
    width: 100%;
    line-height: 44px;
    padding-right: 10px;
    margin-bottom: 15px;
  }
}
.recordTableHt{
  .recordTable{
    .el-table__body-wrapper{
      min-height: 361px;
    }
  } 
}
.myDiv {
  background: #36a3f7;
  line-height: 30px;
  width: 41.16667%;
  width: calc(41.66667% - 20px);
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
  span {
    margin-left: 15px;
  }
}
.myTable{
  /deep/ thead tr{
    background-color: #E7EAEC;
  }
}
.achievement-box {
  overflow: hidden;
  margin-bottom: 10px;
}
</style>