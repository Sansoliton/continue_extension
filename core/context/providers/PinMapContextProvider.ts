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
 * - Created new context provider named pinmap as submenu type context provider
 * - This will parse the pinmap and provide the pin names as context
 * - Added error handling for invalid pinmap files
 */

/* eslint-disable import/extensions */
// import { DOMParser } from "xmldom";
import { getBasename, getUniqueFilePath, groupByLastNPathParts } from "../../util/index.js";
import { walkDir } from "../../indexing/walkDir.js";
// import fs from "fs";/
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
// import { PinMap } from "../../testplan/PinMap.js";

const MAX_SUBMENU_ITEMS = 10_000;
class PinMapContextProvider extends BaseContextProvider {
  static description: ContextProviderDescription = {
    title: "pinMap",
    displayTitle: "Pin Map",
    description: "List of pin map files",
    type: "submenu",
  };

  async getContextItems(
    query: string,
    extras: ContextProviderExtras,
  ): Promise<ContextItem[]> {
    try {
      // console.log("Query: ", query);
      // const pinMapFile = fs.readFileSync(query, "utf8");
      // const parser = new DOMParser();
      // console.log("Pin Map: ", pinMapFile);
      // // const xmlDoc = parser.parseFromString(pinMapFile, "text/xml");
      // // console.log("XML Doc: ", xmlDoc);
      // // const pinMap = new PinMap(query);
      // // await pinMap.init();

      // // const pinNames = pinMap.getPinNames();
      // // console.log("Pin Names: ", pinNames);
      // return [
      //   {
      //     name: "Pin Names",
      //     description: "List of pin names",
      //     content: pinMapFile as any,
      //   },
      // ];
      query = query.trim();
      const content = await extras.ide.readFile(query);
      return [
        {
          name: query.split(/[\\/]/).pop() ?? query,
          description: query,
          content: `\`\`\`${query}\n${content}\n\`\`\``,
        },
      ];
    } catch (error: any) {
      throw new Error(
        `Error in parsing the pin map file. Please provide a valid pinmap file. ${error}`,
      );
    }
  }

  async loadSubmenuItems(
    args: LoadSubmenuItemsArgs,
  ): Promise<ContextSubmenuItem[]> {
    // Extracting the path of the pin map file dynamically
    const workspaceDirs = await args.ide.getWorkspaceDirs();
    const results = await Promise.all(
      workspaceDirs.map((dir) => {
      return walkDir(dir, args.ide);
      }),
    );
    const pinMapFiles = results.flat().filter((file: string) => {
      return path.extname(file) === ".pinmap";
    });
    const files = pinMapFiles.slice(-MAX_SUBMENU_ITEMS);
    const fileGroups = groupByLastNPathParts(files, 2);

    const result =  files.map((file: any) => {
      return {
      id: file,
      title: getBasename(file),
      description: getUniqueFilePath(file, fileGroups),
      };
    });
    return result;
    } catch (error: any) {
      // throw new Error("No pin map file found in the pinmap directory");
      console.log(`Error in loading submenu items: \n ${error}`);
    }
  }

export default PinMapContextProvider;
