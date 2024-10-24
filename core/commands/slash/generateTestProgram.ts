/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Modifications Copyright 2024 Soliton Technologies Private Limited
 * - Created new slash command to generate the test function
 * - Extracted selected test case steps and pinmap names from context
 * - Used fetch API to call the backend API for test function generation
 * - Then create testfunction file and opened it in the IDE
 * - Added error handling for no context selected and error in generating test function
 */

/* eslint-disable @typescript-eslint/naming-convention */
import { SlashCommand } from "../../index.js";

const GenerateTestProgramSlashCommand: SlashCommand = {
  name: "generateTestProgram",
  description: "Generates Test Program",
  run: async function* (sdk) {
    const { ide , input, contextItems } = sdk;
    const [currentDirectory] = await ide.getWorkspaceDirs();
    var userQuery = input.split(this.name)[1].trim();
    console.log("Context Items:", contextItems);
    console.log("User input: ", userQuery);
    const PROTOTPYE_SERVER_URL = "https://api.restful-api.dev/objects";
    const BACKEND_SERVER_URL = "http://vina-copilot-server.azurewebsites.net/ai/measurement/generate_program";
    try {
      const response = await fetch(
        BACKEND_SERVER_URL,
        {
          method: "POST",
          body: JSON.stringify({
            user_question: userQuery,
            measurement_proceedure: contextItems,
            log_requirements: ""
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
        .then((response) => response.json())
        .catch((error) => {
          return error;
        });
        console.log(currentDirectory);
      console.log(response);
      const serverResponse = response.result;
      console.log(serverResponse);
      const filePath = `${currentDirectory}/src/measurements/measurement.py`;
      const fileContent = serverResponse;

      await ide.writeFile(filePath, fileContent);
      await ide.openFile(
        `${currentDirectory}/src/measurements/measurement.py`,
      );
      yield "\n Test methodology procedure was successfully fetched!";
      } catch (error) {
        yield `\n # ${this.name} \n\n Error in generating the test methodology. Please try again.\n ${error}`;
      }
  },
};

export default GenerateTestProgramSlashCommand;
