module.exports.containsSelection = (info, fieldName) => {
  if (!info.fieldNodes?.length) return false;
  return recursivelyFindSelection(info.fieldNodes[0].selectionSet, fieldName);
}

function recursivelyFindSelection(selectionSet, fieldName) {
  if(!selectionSet) { return false; }

  return selectionSet.selections.some((selection) => {
    if(selection.name.value === fieldName) { return true; }

    return recursivelyFindSelection(selection.selectionSet, fieldName);
  });
}
