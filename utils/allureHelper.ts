import * as allure from "allure-js-commons";

export async function setAllureMeta(
  description: string,
  parentSuite: string,
  suite: string,
  subSuite: string,
) {
  await allure.description(description);
  await allure.parentSuite(parentSuite);
  await allure.suite(suite);
  await allure.subSuite(subSuite);
}
