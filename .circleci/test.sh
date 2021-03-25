function error_exit()
{
  echo "$1" 1>&2
  exit 1
}

false || error_exit "Something happened bruh!"