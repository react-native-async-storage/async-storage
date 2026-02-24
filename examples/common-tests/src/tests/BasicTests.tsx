import React from "react";
import { useTestStorage } from "../useTestStorage";
import { useBasicTest } from "../cases/basic";
import { TestRunnerView } from "../components/TestRunnerView";

type Props = {
  storageName: string | null;
};

const BasicTests: React.FC<Props> = ({ storageName }) => {
  const storage = useTestStorage(storageName);
  const basicTest = useBasicTest(storage);
  return <TestRunnerView runner={basicTest} />;
};

export default BasicTests;
