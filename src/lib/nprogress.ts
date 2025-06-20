import NProgress from "nprogress";
NProgress.configure({ showSpinner: false });
let requestCount = 0;
export const startNProgress = () => {
  if (requestCount === 0) {
    NProgress.start();
  }
  requestCount++;
};
export const doneNProgress = () => {
  requestCount--;
  if (requestCount <= 0) {
    NProgress.done();
  }
};