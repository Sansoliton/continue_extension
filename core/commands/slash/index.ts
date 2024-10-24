import GenerateTerminalCommand from "./cmd";
import CommentSlashCommand from "./comment";
import CommitMessageCommand from "./commit";
import DraftIssueCommand from "./draftIssue";
import EditSlashCommand from "./edit";
import HttpSlashCommand from "./http";
import ReviewMessageCommand from "./review";
import ShareSlashCommand from "./share";
import StackOverflowSlashCommand from "./stackOverflow";
import OnboardSlashCommand from "./onboard";
import GenerateTestMethodologySlashCommand from "./generateTestMethodology.js";
import GenerateTestProgramSlashCommand from "./generateTestProgram.js";

export default [
  GenerateTestMethodologySlashCommand,
  GenerateTestProgramSlashCommand,
  DraftIssueCommand,
  ShareSlashCommand,
  StackOverflowSlashCommand,
  GenerateTerminalCommand,
  EditSlashCommand,
  CommentSlashCommand,
  HttpSlashCommand,
  CommitMessageCommand,
  ReviewMessageCommand,
  OnboardSlashCommand,
];
