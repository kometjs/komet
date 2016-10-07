// https://github.com/babel/babel/blob/master/packages/babel-core/src/helpers/resolve.js
import Module from 'module';
import path from 'path';

export default function (loc: string, relative: string = process.cwd()): ?string {
  let relativeMod = new Module();

  // We need to define an id and filename on our "fake" relative` module so that
  // Node knows what "." means in the case of us trying to resolve a plugin
  // such as "./myPlugins/somePlugin.js". If we don't specify id and filename here,
  // Node presumes "." is process.cwd(), not our relative path.
  // Since this fake module is never "loaded", we don't have to worry about mutating
  // any global Node module cache state here.
  let filename = path.join(relative, 'package.json');
  relativeMod.id = filename;
  relativeMod.filename = filename;
  relativeMod.paths = Module._nodeModulePaths(relative);

  try {
    return Module._resolveFilename(loc, relativeMod);
  } catch (err) {
    console.log(err.stack);
    return null;
  }
}
