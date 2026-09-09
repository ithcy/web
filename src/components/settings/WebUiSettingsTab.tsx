import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel, FormHelperText } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import { useInvoker } from "../../services/jsonrpc";

const readSingleFile = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      const idx = reader.result?.toString().indexOf("base64,")!;
      const data = reader.result?.toString().substring(idx + "base64,".length);
      if (!data) return reject();
      resolve(data);
    };
    reader.onerror = () => reject();
    reader.readAsDataURL(blob);
  });
}

// Deliberately not using Formik/<Form> here - this tab lives inside the
// settings drawer's own <Form>, and a nested HTML <form> is invalid and
// breaks submit behavior.
export default function WebUiSettingsTab() {
  const webuiInstall = useInvoker("webui.install");
  const [ data, setData ] = useState("");
  const [ installing, setInstalling ] = useState(false);

  return (
    <Box w={"md"}>
      <FormControl>
        <FormLabel>Web UI package file</FormLabel>
        <Input
          type="file"
          onChange={async e => {
            if (e.currentTarget.files != null) {
              setData(await readSingleFile(e.currentTarget.files[0]));
            }
          }}
        />
        <FormHelperText>A zip file containing the web UI to install.</FormHelperText>
      </FormControl>
      <Button
        colorScheme={"purple"}
        disabled={!data || installing}
        mt={3}
        type={"button"}
        onClick={async () => {
          setInstalling(true);
          await webuiInstall({ data });
          window.location.reload();
        }}
      >
        Install web UI
      </Button>
    </Box>
  )
}
