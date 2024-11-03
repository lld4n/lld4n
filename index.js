import fs from "fs"

const md = "<!--LEETCODE-->"

const url = 'https://leetcode.com/graphql';
const username = 'lldan';

const query = `
{
  allQuestionsCount {
    difficulty
    count
  }
  matchedUser(username: "${username}") {
    username
    submitStats: submitStatsGlobal {
      totalSubmissionNum {
        difficulty
        count
      }
    }
  }
}`


const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({query}),
};


async function main() {
  const data = await fetch(url, options);
  const json = await data.json();


  if (!json.data) {
    return;
  }

  const info = {
    All: {solved: 0, count: 0},
    Easy: {solved: 0, count: 0},
    Medium: {solved: 0, count: 0},
    Hard: {solved: 0, count: 0},
  }

  for (const total of json.data.allQuestionsCount) {
    info[total.difficulty].total = total.count;
  }

  for (const total of json.data.matchedUser.submitStats.totalSubmissionNum) {
    info[total.difficulty].count = total.count;
  }

  const readme = fs.readFileSync("./README.md").toString()

  const spl = readme.split(md)

  let stat = `\n\`\`\`\n`
  stat += "leetcode\n\n"

  for (const key in info) {
    stat += up(key)
    stat += up(info[key].count.toString())
    stat += line(info[key].total, info[key].count)
    stat += percentage(info[key].count, info[key].total) + "\n"
  }

  stat += "\`\`\`\n"
  stat += new Date().toLocaleString() + "\n"

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