// Libs
// Components
import { CounterButton } from "./index.styles";

interface HomeContainerProps {}

const HomeContainer: React.FC<HomeContainerProps> = ({ ...rest }) => {
  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <CounterButton />
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
};
export default HomeContainer;
