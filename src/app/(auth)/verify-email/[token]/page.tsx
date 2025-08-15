const VerifyEmailPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <h1 className="text-2xl font-bold mt-4">Verifying your email...</h1>
      <p className="text-base-content/70">
        Please wait, we're redirecting you.
      </p>
    </div>
  );
};

export default VerifyEmailPage;
