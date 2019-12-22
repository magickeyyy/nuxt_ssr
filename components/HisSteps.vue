// 默认注册步骤、当前在第一步且成功
<template>
    <div class="hisSteps">
        <div :class="['step',currentClass(i)]" v-for="(v,i) in steps" :key="i">
            <p>{{v}}</p>
            <div>{{i+1}}</div>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
		  
      };
    },
    props:{
        type:{ // 进度条类型 regist,hotelOrder...
            default:'regist',
            type:String
        },
        current:{ // 当前进度
            default:function(){
                return {success:true,index:1};
            },
            type: Object
        },
    },
    computed:{
        steps(){
            switch (this.type) {
                case 'hotelOrder':
					return ['填写订单','支付订单','确认成功','提交分房名单','获得voucher'];
				case 'playOrder':
                    return ['填写订单','支付订单','等待确认','获得voucher'];
                default:
                    return ['验证手机号','填写企业信息','提交审核']; // 注册
            }
        }
    },
    methods:{
        currentClass(i) {
            if(i<this.current.index-1){
                return 'old';
            } else if(i===this.current.index-1){
                if(this.current.success) return 'current';
                return 'failed'
            }
            else return;
        }
    }
  };
</script>

<style scoped lang="less">
.hisSteps {
	// 步骤 <div class="steps"> <div class="step active"><p>填写订单</p><div>1</div></div></div>
	display: flex;
	justify-content: center;

	.step {
		display: flex;
		width: 210px;
		flex-direction: column;
		align-items: center;

		div {
			line-height: 32px;
			width: 32px;
			border-radius: 50%;
			color: #fff;
			text-align: center;
			background-color: rgb(215, 215, 215);
			position: relative;
		}

		div::after {
			content: "";
			display: block;
			width: 180px;
			max-width: 180px;
			min-width: 100px;
			border-bottom: 2px dashed rgb(215, 215, 215);
			position: absolute;
			top: 50%;
			left: 42px;
		}

		p {
			line-height: 32px;
			border-radius: 16px;
			font-size: 16px;
			padding: 0 18px;
			color: rgb(215, 215, 215);
			position: relative;
			margin-bottom: 12px;
		}
	}

	.step.current {
		div {
			background-color: #EA037C;
		}

		p {
			background-color: #EA037C;
			color: #fff;
		}

		p::after {
			content: "";
			display: block;
			border-top: 6px solid #EA037C;
			border-left: 6px solid transparent;
			border-right: 6px solid transparent;
			border-bottom: 6px solid transparent;
			position: absolute;
			left: 50%;
			margin-left: -6px;
			bottom: -12px;
		}

		div::after {
			border-color: #EA037C;
		}
    }
    .step.old{
        p {
			color: #EA037C;
        }
        div {
			background-color: #EA037C;
		}
        div::after {
			border-color: #EA037C;
		}
    }
    .step.failed {
		div {
			background-color: #333;
		}

		p {
			background-color: #333;
			color: #fff;
		}

		p::after {
			content: "";
			display: block;
			border-top: 6px solid #333;
			border-left: 6px solid transparent;
			border-right: 6px solid transparent;
			border-bottom: 6px solid transparent;
			position: absolute;
			left: 50%;
			margin-left: -6px;
			bottom: -12px;
		}

		div::after {
			border-color: #333;
		}
	}

	>div:last-child {
		div:after {
			display: none;
		}
	}
}
</style>
