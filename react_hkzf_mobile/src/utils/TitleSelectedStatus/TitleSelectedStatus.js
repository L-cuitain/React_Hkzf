/**
 * 封装 FindHouse -> Filter 组件中的FilterTitle 显示高亮方法
 * @param {Array} titleSelectedStatus 当前高亮状态 
 * @param {Array} selectValue  当前筛选条件
 */
function TitleSelectedStatus(type , titleSelectedStatus , selectValue){
    //根据当前标题选中状态对象 获取一个新的标题选中状态对象
    const newTitleSelectedStatus = {...titleSelectedStatus};

    //使用Object.key 获取对象中每个key
    Object.keys(titleSelectedStatus).forEach(item => {
        //获取每个tempValue键对应的值
        const tempType = selectValue[item];

        if(type !== null && type === item){
            newTitleSelectedStatus[item] = true;
            return newTitleSelectedStatus;
        }

        //判断tempType的值 来决定是否高亮
        if(item === 'area' && (tempType.length === 3 || tempType[0] !== 'area')){
            newTitleSelectedStatus[item] = true;
        }else if(item === 'mode' && tempType[0] !== 'null'){
            newTitleSelectedStatus[item] = true;
        }else if(item === 'price' && tempType[0] !== 'null'){
            newTitleSelectedStatus[item] = true;
        }else if(item === 'more' && tempType.length !== 0){
            newTitleSelectedStatus[item] = true;
        }else{
            //不满足以上情况 则取消高亮
            newTitleSelectedStatus[item] = false;
        }
    })

    return newTitleSelectedStatus;
}

export default TitleSelectedStatus;