import NProgress from "nprogress";

// You can configure the appearance here if you want
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
