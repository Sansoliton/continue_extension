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
 * - Created new context provider named test function as submenu type context provider
 * - This will parse the test plan file
 * - In submenu it will list all the test cases available in the test plan
 * - When user selects a test case, the corresponding context will be returned
 * - Added error handling for invalid test plan files
 */

/* eslint-disable import/extensions */
// import os
import path from "path";
import {
  ContextItem,
  ContextProviderExtras,
  ContextProviderDescription,
  CustomContextProvider,
  LoadSubmenuItemsArgs,
  ContextSubmenuItem,
} from "../../index.js";
import { BaseContextProvider } from "../index.js";


import { walkDir } from "../../indexing/walkDir.js";
import {
  getBasename,
  getUniqueFilePath,
  groupByLastNPathParts,
} from "../../util/index.js";

const MAX_SUBMENU_ITEMS = 10_000;
class DataSheetContextProvider extends BaseContextProvider {
  static description: ContextProviderDescription = {
    title: "dataSheet",
    displayTitle: "datasheet",
    description: "List of data sheets from the project",
    type: "submenu",
  };

  async getContextItems(
    query: string,
    extras: ContextProviderExtras,
  ): Promise<ContextItem[]> {
      try {
        console.log("path", path);
        const [currentDirectory] = await extras.ide.getWorkspaceDirs();
        const filePath = path.join(currentDirectory, "datasheet", query);
        const fileContent = await extras.ide.readFile(path.resolve(filePath));
        console.log("filePath : ", filePath);
        console.log("fileContent : ", fileContent);

        return [
          {
            name: query,
            description: query,
            content: (await fileContent).toString(),
          },
        ];
      } catch (error) {
        console.log("Error reading file:", error);
        return [];
      }
    // }
  }

  async loadSubmenuItems(
    args: LoadSubmenuItemsArgs,
  ): Promise<ContextSubmenuItem[]> {
    try {
      const [currentDirectory] = await args.ide.getWorkspaceDirs();
      const datasheetDirPath = path.join(currentDirectory, "datasheet");
      const workspaceDirs = await args.ide.listDir(datasheetDirPath);
      console.log("workspace dir: ", workspaceDirs);
      
      const result = workspaceDirs.map((file) => {
        return {
          id: file[0],
          title: getBasename(file[0]),
          description: "",
        };
      });
      console.log("Datasheet result : ", result);
      return result;
    } catch (error) {
      console.log("Error loading submenu items:", error);
      return [];
    }
  }
}

export default DataSheetContextProvider;
