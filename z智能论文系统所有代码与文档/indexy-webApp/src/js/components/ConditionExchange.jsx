/**
 * Created by miffy on 2017/01/22
 */
//用来返回定制中的对应条件
//@params e 要转换的条件

export default function exchange(e) {
  switch(e) {
    case 'and':
    return '并且'
    break;
    case 'or':
    return '或者'
    break;
    case 'notContain': 
    return '不含'
    break;
    case '并且':
    return 'and'
    break;
    case '或者':
    return 'or'
    break;
    case '不含':
    return 'notContain'
    break;
  }
}