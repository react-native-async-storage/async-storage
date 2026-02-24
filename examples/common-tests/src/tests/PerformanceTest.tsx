import React from "react";
import { useTestStorage } from "../useTestStorage";
import { usePerformanceTest } from "../cases/performance.tsx";
import { TestRunnerView } from "../components/TestRunnerView";

type Props = {
  storageName: string | null;
};

const PerformanceTest: React.FC<Props> = ({ storageName }) => {
  const storage = useTestStorage(storageName);
  const basicTest = usePerformanceTest(storage);
  return <TestRunnerView runner={basicTest} />;
};

export default PerformanceTest;
