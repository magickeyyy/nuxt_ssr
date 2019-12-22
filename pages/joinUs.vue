<template>
  <div class="joinus">
    <h3 class="container">技术类</h3>
    <ul class="container mode">
        <li v-for="(v,i) in job.tec" :key="i" @click="upfold('tec',i)">
            <div :class="['title',{'active': v.upfold}]"><p>{{v.name}}</p><p>{{v.exp}}</p><p>{{v.money}}</p></div>
            <transition-group name="upfold">
                <div v-show="v.upfold" class="desc" :key="i">
                    <h3>{{v.name}}</h3>
                    <div><span>{{v.money}}</span> {{v.exp}}</div>
                    <h4>岗位职责</h4>
                    <ul>
                        <li v-for="(item,index) in v.resp" :key="index">{{item}}</li>
                    </ul>
                    <h4 class="request">任职要求</h4>
                    <ul>
                        <li v-for="(item,index) in v.req" :key="index">{{item}}</li>
                    </ul>
                </div>
            </transition-group>
        </li>
    </ul>
    <h3 class="container">运营类</h3>
    <ul class="container mode">
        <li v-for="(v,i) in job.ope" :key="i" @click="upfold('ope',i)">
            <div :class="['title',{'active': v.upfold}]"><p>{{v.name}}</p><p>{{v.exp}}</p><p>{{v.money}}</p></div>
            <transition name="upfold">
                <div v-show="v.upfold" class="desc">
                    <h3>{{v.name}}</h3>
                    <div><span>{{v.money}}</span> {{v.exp}}</div>
                    <h4>岗位职责</h4>
                    <ul>
                        <li v-for="(item,index) in v.resp" :key="index">{{item}}</li>
                    </ul>
                    <h4 class="request">任职要求</h4>
                    <ul>
                        <li v-for="(item,index) in v.req" :key="index">{{item}}</li>
                    </ul>
                </div>
            </transition>
        </li>
    </ul>
  </div>
</template>
<script>
export default {
    name: 'joinus',
    layout:'home',
    data(){
        return {
            job:{
                tec:[
                   {
                       name: '高级Java',
                       money: '15-24k',
                       exp: '5-10年',
                       resp: [
                        '1、负责互联网后端的研发，保障系统的稳定性和质量；',
                        '2、与业务需求部门及项目经理沟通，理解需求，进行架构设计；',
                        '3、搭建开发框架、负责核心代码的编写，解决技术难点；',
                        '4、界定、分析和解决系统中存在的问题和缺陷；',
                        '5、参与软件设计重构、优化，保证产品迭代及可维护。'
                       ],
                       req: [
                            '1、计算机及相关专业本科以上学历，5年以上开发经验；',
                            '2、扎实的Java基础，熟练运用常见设计模式，具备良好的编码规范，精通面向对象设计及编程；',
                            '3、熟练掌握Java的io、多线程、集合等基础框架，熟悉JVM原理及调优；',
                            '4、精通各类主流框架和原理，不限于SpringMVC、MyBatis、Springboot等；',
                            '5、熟悉常用分布式开源框架SpringCloud/Dubbo等，有分布式缓存Redis、RabbitMQ、Kafka实战经验，并掌握其原理及机制；',
                            '6、熟悉Mysql、Oracle等常见数据库，并具有良好的SQL编写及优化能力，有NoSQL使用经验；',
                            '7、有良好的沟通能力，善于思考，积极主动，乐于分享，团队精神佳，能承受工作压力，富有进取心与执行力；',
                            '8、有互联网，在线电商、OTA等经验优先。'
                       ],
                       upfold: false
                   },
                   {
                       name: 'Java开发',
                       money: '11-16k',
                       exp: '3-5年',
                       resp: [
                        '1、理解业务需求，参与产品需求讨论及梳理；',
                        '2、独立完成需求分析、设计、编码工作；',
                        '3、参与公司业务重构设计与模块开发及维护。'
                       ],
                       req: [
                            '1、计算机及相关专业本科以上学历，3年以上开发经验；',
                            '2、扎实的Java基础，具备良好的编码规范；',
                            '3、熟悉Java的io、多线程、集合等基础框架；',
                            '4、熟练掌握常用的开源JavaEE应用框架，如Spring、Springboot、SpringMVC、MyBatis等；',
                            '5、熟悉Oracle、Mysql等常见数据库，具有SQL性能调优经验；',
                            '6、有良好的沟通能力，善于思考，积极主动，乐于分享，团队精神佳，能承受工作压力，富有进取心与执行力；',
                            '7、有互联网，在线电商、OTA等经验优先。',
                       ],
                       upfold: false
                   },
                   {
                       name: '前端开发工程师（高级）',
                       money: '10-15k',
                       exp: '5-10年',
                       resp: [
                        '1、负责Web产品的前端表现层与后端交互的设计和开发，保证页面浏览的兼容性和流畅性；',
                        '2、负责Javascript程序模块的开发，通用类库和框架的编写；',
                        '3、负责配合产品经理、后端开发人员实现产品界面；',
                        '4、负责制定产品前端代码的规范，最大限度地实现代码的可重用性；',
                        '5、负责产品的交互界面设计，分析用户的使用习惯和偏好；从用户体验的角度出发，提出最优的界面交互设计方案；',
                        '6、负责前段端开发用框架的分析、选型工作，参与产品的原型讨论和整体UE设计，规划产品界面交互设计方案。'
                       ],
                       req: [
                            '1、大学统招本科及以上学历，计算机相关专业，5年以上前端开发经验；',
                            '2、精通HTML、HTML5、CSS、JavaScript、ES6、JQuery、Ajax、react或Vue等前端技术；具备快速的编写和修改代码的能力，能灵活使用工具调试代码；熟悉浏览器兼容性和解决方案。',
                            '3、具备至少两种框架的实际开发经验，拥有Vue开发经验优先；',
                            '4、具有微信企业号、小程序等开发经验；',
                            '5、编码遵循w3c标准，有简洁高效、语义化强的前端开发风格；',
                            '6、具备较好的美术基础和审美能力，熟悉当前的设计风格和趋势，对色彩敏感；',
                            '7、对用户体验、交互操作流程及用户需求有深入理解，具备敏锐的用户体验洞察力，能把握不同的设计风格；',
                            '8、工作认真，有责任心，踏实可靠，沟通表达能力较好，注重团队合作，良好的职业操守。'
                       ],
                       upfold: false
                   }
                ],
                ope:[
                    {
                       name: '酒店运营专员',
                       money: '4-6k',
                       exp: '',
                       resp: [
                        '1、负责海无疆电商平台酒店频道的日常运营管理；',
                        '2、负责酒店频道的筹建，包括API筛选确定，内部团组酒店沟通，确定预定及退改流程和规则；',
                        '3、解决企业客户酒店预订、退改中遇到的问题',
                        '4、对酒店资源做分级评估，分级定价与运营，并达成既定销售目标。'
                       ],
                       req: [
                            '1、1年以上在线酒店运营经验，有酒店B2B平台经验优先；',
                            '2、具备良好的数据分析能力和学习力；',
                            '3、具备良好的团队精神和合作意识；',
                            '4、一定的英语听读写能力。'
                       ],
                       upfold: false
                   },
                   {
                       name: '机票/大车/火车票运营专员',
                       money: '4-6k',
                       exp: '',
                       resp: [
                        '1、承接用户出行需求,定制行程，提供机票/大车/火车票大交通解决方案；',
                        '2、掌握用户沟通技巧，全程跟进订单,解决用户问题，对订单转化率及用户满意度负责；',
                        '3、维系管理供应商，挖掘客户资源，保证服务质量及稳定转化；',
                        '4、制定运营规范，优化业务流程，结合实操，定期输出运营文档及数据报告；',
                        '5、结合小团业务，提出APP端产品优化意见，推进产品迭代。'
                       ],
                       req: [
                            '1、2年以上机票行业工作经验，熟悉掌握国内、国际各航空公司运价体系、航班线路知识及出票规定；有航空机票资源、熟悉订票系统优先考虑；',
                            '2、1年以上境外大车、火车票运营经验；',
                            '3、有一定C端用户及B端合作伙伴沟通技能，拥有较强职业素养；',
                            '4、可适应互联网的工作节奏，有一定抗压性，接受小组值班排班、节假日轮班等安排；',
                            '5、5.对数据敏感，认真心细，能够熟练使用Word、Excel、PPT等办公软件；',
                            '6、大专以上学历，沟通与执行能力强，有良好的合作精神和团队意识。'
                       ],
                       upfold: false
                   },
                   {
                       name: '玩乐产品运营专员/主管/经理',
                       money: '4-6k 5-8k',
                       exp: '',
                       resp: [
                        '1、熟悉了解欧洲出境游（跟团和自由行）市场及趋势，制定玩乐产品频道发展规划；',
                        '2、筛选API和直采资源品类，制定预定及退改规则；',
                        '3、根据企业用户及消费趋势，对玩乐等产品分级分类，并标注标签；',
                        '4、针对企业用户（商旅、游学）提供整体玩乐产品解决方案；',
                        '5、根据客户反馈、预定及退改，对现有供应商及资源做分级管理；',
                        '6、定期对玩乐产品做经营数据分析，调整玩乐产品运营策略。'
                       ],
                       req: [
                            '1、本科及以上学历，2年以上在线旅游玩乐产品（特色主体、商旅、游学等）运营工作经验；',
                            '2、具有2B和2C经验，擅长用户、内容、平台运营；',
                            '3、一定的英语听读写能力；',
                            '4、具备良好的数据分析能力、学习力、抗压能力、沟通能力和团队合作精神。'
                       ],
                       upfold: false
                   },
                   {
                       name: '司导运营助理',
                       money: '4-6k',
                       exp: '',
                       resp: [
                        '1、负责项目启动阶段相关筹备工作，包括竞品分析、司导产品资料整理、预定退改流程整理等；',
                        '2、负责协助产品研发部门提供开发必要的项目产品数据、资料、文案等；',
                        '3、负责协助部门负责人沟通确定司导项目相关产品、流程、规则的制定；',
                        '4、负责联系沟通种子用户的测试，产品反馈，并与技术沟通解决相关问题；',
                        '5、视能力在产品运营阶段安排其他运营工作。'
                       ],
                       req: [
                            '1、大专以上学习，有地接、导游调度、管理经验优先；有电商相关运营助理优先；',
                            '2、善于学习，沟通力强，性格开朗，有团队精神。'
                       ],
                       upfold: false
                   }
                ]
            }
        }
    },
    methods: {
        upfold(obj,i){
            this.job[obj][i].upfold = !this.job[obj][i].upfold;
        }
    }
}
</script>

<style lang="less" scoped>
  *{
    box-sizing: content-box;
  }
  .container{
    width: 1200px;
  }
  .joinus{
      >h3{
          font-size: 24px;
          line-height: 82px;
          padding-top:20px;
          border-bottom: 1px solid #e7e7e7;
          font-weight: bold;
          margin-bottom: 6px;
      }
      >ul{
          padding: 10px 0 30px;
          >li{
              .title{
                  display: flex;
                  color: #666;
                  font-size:14px;
                  line-height: 60px;
                  cursor:pointer;
                  padding-bottom: 2px;
                  p:first-child{
                      position: relative;
                      padding-left: 42px;
                      width: 742px;
                  }
                  p:first-child::before{
                      content: "+";
                      display: block;
                      position: absolute;
                      top:-2px;
                      left:0;
                      font-size:24px;
                  }
                  p:nth-child(2){
                      width: 350px;
                  }
              }
              .title.active{
                  p:first-child::before{
                      content: "-";
                      font-size: 30px;
                  }
              }
              .desc{
                  padding-left: 42px;
                  h3{
                      line-height: 34px;
                      font-size: 28px;
                  }
                  div{
                      line-height: 62px;
                      font-size: 14px;
                      span{
                          color:#e9047b;
                          font-size: 20px;
                      }
                  }
                  h4{
                      line-height: 42px;
                      font-size: 18px;
                  }
                  ul{
                      li{
                          line-height: 38px;
                          font-size: 14px;
                      }
                      li:last-child{
                          padding-bottom:48px;
                      }
                  }
              }
          }
      }
  }
</style>
