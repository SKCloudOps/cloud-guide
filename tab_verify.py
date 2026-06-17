lines = open('c:/Sathish/me-new/cloud-guide/enterprise-aws-arch.html', encoding='utf-8').readlines()
print('Total lines:', len(lines))
checks = ['tab-nav', 'id="tab-basic"', 'id="tab-enhanced"', 'end arch-wrapper', 'LIGHTBOX.*Architecture v1', 'id="aws-tip"', 'switchTab', '</script>', '</body>']
import re
for kw in checks:
    for i, l in enumerate(lines):
        if re.search(kw, l):
            print(f'  L{i+1}: {l.rstrip()[:100]}')
            break
