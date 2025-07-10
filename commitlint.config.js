/*
 * @Description: file content
 * @version: 0.1.0
 * @Author: wys
 * @Date: 2022-07-04 11:01:03
 * @LastEditors: wys
 * @LastEditTime: 2022-07-04 11:01:10
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'build', 'chore', 'ci', 'feat', 'docs', 'fix', 'perf', 'revert', 'refactor', 'style', 'test', 'init', 'build', 'release', 'delete'
    ]],
  }
};