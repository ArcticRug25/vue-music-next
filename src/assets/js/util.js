// 简易洗牌算法
export function shuffle(source) {
  // 防止改变原数组的副作用
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

// 获取一个 0 ~ max 闭区间的随机数
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}

// 将数组 arr 中的 i、j 项进行交换
function swap(arr, i, j) {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}
