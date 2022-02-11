FOLDER=FlappyBlock/*
OUTPUT_DIR=docs/

for filename in $OUTPUT_DIR*;
do
  if [ $filename != "${OUTPUT_DIR}CNAME" ];
  then
    rm -f $filename;
    echo "removed $filename";
  fi;
done

for filename in $FOLDER*;
do
  if [ ${filename##*/} != "README.md" ];
    then
      ln -f $filename $OUTPUT_DIR;
      echo "linked $filename";
  fi;
done