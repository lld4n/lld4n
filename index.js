import fs from "fs"

const md = "<!--LEETCODE-->"

async function main() {
  const data = await fetch("https://leetcode-stats-api.herokuapp.com/lldan");
  const json = await data.json();

  if (!json.easySolved) {
    return
  }

  const info = {
    total: {solved: json.totalSolved, all: json.totalQuestions},
    easy: {solved: json.easySolved, all: json.totalEasy},
    medium: {solved: json.mediumSolved, all: json.totalMedium},
    hard: {solved: json.hardSolved, all: json.totalHard}
  }
  const readme = fs.readFileSync("./README.md").toString()

  const spl = readme.split(md)

  let stat = `\n\`\`\`\n`
  stat += "leetcode\n\n"

  for (const key in info) {
    stat += up(key)
    stat += up(info[key].solved.toString())
    stat += line(info[key].all, info[key].solved)
    stat += percentage(info[key].solved, info[key].all) + "\n"
  }

  stat += new Date().toLocaleString() + "\n\n"
  stat += "\`\`\`\n"

  fs.writeFileSync('./README.md', [spl[0], stat, spl[2]].join(md))


}

function up(str) {
  let res = str;

  while (res.length < 10) {
    res += " "
  }

  return res
}

function line(all, solved) {
  let res = ""

  const c = (solved / all) * 100
  let a = 0

  while (a < c) {
    a += 5
    res += "█"
  }

  while (res.length < 20) {
    res += "░"
  }

  return res + " "
}

export function percentage(up, down) {
  let value = String(((up / down) * 100).toFixed(2));
  while (value.length !== 5) {
    value = "0" + value;
  }
  return value + " %";
}

main().then(() => console.log("Finish"))