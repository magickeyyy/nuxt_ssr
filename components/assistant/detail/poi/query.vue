<template>
    <div class="query_chooesB">
        <Select v-model="chooesData" multiple @on-change="chooesChange" style="width:550px;">
            <OptionGroup :label="item.name" v-for="(item, i) in filterListData" :key="i+'_lab'">
                <Option
                    v-for="(it, j) in item.value"
                    :value="item.mode+'_'+item.name+'_'+it.value"
                    :key="j+'_item'"
                    :class="item.mode === 'multiple'?'multipleStyle':''"
                >
                    <Checkbox v-if="item.mode === 'multiple'" v-model="it.check"></Checkbox>
                    {{ it.label }}
                    <span @click="innerCheckBox(i,j,item.mode)" class="innerShow"></span>
                </Option>
            </OptionGroup>
        </Select>
    </div>
</template>

<script>
export default {
    name: '',
    props: ['filterListData'],
    data() {
        return {
            chooesData: [],
        };
    },
    methods: {
        innerCheckBox(i, j, mode) {
            if (mode === 'multiple') {
                let a = this.filterListData[i];
                a.value[j].check = !a.value[j].check;
            }
        },
        chooesChange() {
            let temp = JSON.parse(JSON.stringify(this.chooesData));
            let obj = [];
            let res = [];
            temp.map(it => {
                let t = {};
                t.mode = it.split('_')[0];
                t.name = it.split('_')[1];
                t.value = it.split('_')[2];
                obj.push(t);
            });

            const last = obj[obj.length - 1];
            if (last) {
                let l = obj.filter(ii => ii.name === last.name);
                if (last.mode === 'single' && l.length > 1) {
                    let t = 0;
                    obj.map((it, i) => {
                        if (it.name === l[0].name && t === 0) {
                            obj.splice(i, 1);
                            t++;
                        }
                    });
                }
                res = obj.map(it => it.mode + '_' + it.name + '_' + it.value);
            }
            this.chooesData = res;
        },
    },
};
</script>

<style lang="less">
.query_chooesB {
    .ivu-select-selection {
        border: none;
        outline: none !important;
        box-shadow: none !important;
        .ivu-tag-checked {
            background: none;
            border: none;
            line-height: 26px;
            margin-right: 0;
            padding: 0 4px;
            .ivu-tag-text {
                margin-right: 0px;
            }
        }
    }
    .ivu-icon {
        display: none;
    }
    .ivu-select-group-wrap {
        margin-bottom: 4px;
        .ivu-select-group-title {
            vertical-align: top;
            width: 70px;
            display: inline-block !important;
        }
        ul {
            vertical-align: top;
            max-width: 600px;
            li {
                padding: 4px 8px;
                position: relative;
                .innerShow {
                    position: absolute;
                    display: inline-block;
                    width: 100%;
                    height: 25px;
                    left: 0;
                    top: 0;
                }
            }
            display: inline-block !important;
            .ivu-select-group {
                display: inline-block !important;
                .ivu-select-item {
                    display: inline-block !important;
                }
                .ivu-select-item {
                    border-radius: 6px;
                    &:hover {
                        background: none;
                    }
                }
                .ivu-select-item-selected {
                    color: #fff;
                    background: #ec0286 !important;
                    border-radius: 6px;
                    &::after {
                        display: none;
                    }
                    &:hover {
                        background: #ec0286;
                    }
                }
                .ivu-select-item-focus {
                    background: none;
                    border-radius: 6px;
                    &:hover {
                        background: none;
                    }
                }
                .multipleStyle {
                    color: #111;
                    background: none !important;
                    &:hover {
                        background: none;
                    }
                    .ivu-checkbox-default {
                        margin-right: 2px;
                    }
                }
            }
        }
    }
}
</style>
