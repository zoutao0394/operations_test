#encoding: utf8
import rpyc
import sys

if len(sys.argv) != 2:
    print("Usage: %s [run|status]" % (sys.argv[0]))
    sys.exit(-1)

task=sys.argv[1]
if task == 'run':
    c = rpyc.connect("172.16.20.33", 12345)
    res= c.root.back_restore()
    print(res)
elif task == 'status':
    c = rpyc.connect("172.16.20.33", 12345)
    res = c.root.get_result()
    for line in res:
        line = line.strip()
        print(line)
else:
    print("Usage: %s [run|status]" % (sys.argv[0]))
