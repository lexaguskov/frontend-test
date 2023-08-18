export const App = () => {
  const helloWorld = () => {
    // fetch hello world endpoint
    return "hello world";
  };

  return <div>{helloWorld()}</div>;
};
