const fs = require('fs');

const path = 'c:/Sathish/me-new/cloud-guide/qa.html';
const content = fs.readFileSync(path, 'utf-8');

const startIndex = content.indexOf('const D = [');
const endIndex = content.indexOf('];', startIndex) + 2;

const arrayString = content.substring(startIndex + 10, endIndex - 1); // just the array

let D;
try {
    D = eval('(' + arrayString + ')');
} catch (e) {
    console.error("Eval error", e);
    process.exit(1);
}

const firstThree = D.slice(0, 3);
const remaining = D.slice(3);

const allItems = remaining.flatMap(r => r.items);

const categories = {
    "Introduction & Career Strategy": { id: "intro", cls: "c-intro", icon: "👤", items: [] },
    "AWS Architecture & Core Compute": { id: "aws", cls: "c-aws", icon: "☁", items: [] },
    "AWS Networking & Load Balancing": { id: "net", cls: "c-net", icon: "🌐", items: [] },
    "AWS IAM & Security": { id: "sec", cls: "c-sec", icon: "🔒", items: [] },
    "Kubernetes & Containers": { id: "k8s", cls: "c-k8s", icon: "☸", items: [] },
    "Infrastructure as Code & CI/CD": { id: "iac", cls: "c-iac", icon: "🏗", items: [] },
    "Databases & Storage": { id: "db", cls: "c-s3", icon: "🗄", items: [] },
    "Observability, DevOps & Operations": { id: "ops", cls: "c-graf", icon: "📊", items: [] },
    "Linux, Scripting & Git": { id: "lnx", cls: "c-lnx", icon: "🐧", items: [] }
};

for (const item of allItems) {
    const q = item.q.toLowerCase();
    const g = item.g.toLowerCase();
    
    if (q.includes("how are you") || q.includes("introduce yourself") || q.includes("career") || q.includes("aspiration") || q.includes("ai ") || q.includes("fresher") || g.includes("intro") || g.includes("career")) {
         categories["Introduction & Career Strategy"].items.push(item);
    }
    else if (q.includes("iam") || q.includes("security") || q.includes("kms") || q.includes("secret") || q.includes("sso") || q.includes("credential") || g.includes("sec") || g.includes("kms")) {
        categories["AWS IAM & Security"].items.push(item);
    } 
    else if (q.includes("vpc") || q.includes("subnet") || q.includes("transit gateway") || q.includes("peering") || q.includes("routing") || q.includes("load balancer") || q.includes("alb") || q.includes("nlb") || q.includes("api gateway") || g.includes("net") || g.includes("lb")) {
        categories["AWS Networking & Load Balancing"].items.push(item);
    }
    else if (q.includes("kubernetes") || q.includes("k8s") || q.includes("docker") || q.includes("eks") || q.includes("ecs") || q.includes("ecr") || q.includes("pod") || q.includes("helm") || q.includes("argocd") || q.includes("container") || g.includes("k8s") || g.includes("dk") || g.includes("docker") || g.includes("eks")) {
        categories["Kubernetes & Containers"].items.push(item);
    }
    else if (q.includes("terraform") || q.includes("cloudformation") || q.includes("ansible") || q.includes("deploy") || q.includes("ci/cd") || q.includes("pipeline") || q.includes("iac") || g.includes("tf") || g.includes("iac") || g.includes("ans")) {
        categories["Infrastructure as Code & CI/CD"].items.push(item);
    }
    else if (q.includes("s3") || q.includes("rds") || q.includes("aurora") || q.includes("dynamodb") || q.includes("database") || g.includes("db") || g.includes("s3") || g.includes("rds")) {
        categories["Databases & Storage"].items.push(item);
    }
    else if (q.includes("grafana") || q.includes("prometheus") || q.includes("alert") || q.includes("troubleshoot") || q.includes("investigate") || q.includes("cost") || q.includes("optimiz") || q.includes("monitor") || q.includes("incident") || g.includes("graf") || g.includes("cost") || g.includes("debug") || g.includes("ops")) {
        categories["Observability, DevOps & Operations"].items.push(item);
    }
    else if (q.includes("linux") || q.includes("git") || q.includes("bash") || q.includes("chmod") || q.includes("pm2") || q.includes("process") || q.includes("port") || q.includes("cache") || q.includes("cron") || q.includes("ssl") || g.includes("lnx") || g.includes("pm2") || g.includes("git")) {
        categories["Linux, Scripting & Git"].items.push(item);
    }
    else {
        categories["AWS Architecture & Core Compute"].items.push(item);
    }
}

const newSections = Object.keys(categories).map(k => {
    return {
        s: k,
        id: categories[k].id,
        cls: categories[k].cls,
        icon: categories[k].icon,
        items: categories[k].items
    };
}).filter(s => s.items.length > 0);

const finalD = [...firstThree, ...newSections];

function jsStringify(obj, indent = "") {
    if (typeof obj === "string") {
        return '`' + obj.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$") + '`';
    } else if (Array.isArray(obj)) {
        if (obj.length === 0) return "[]";
        const innerIndent = indent + "  ";
        return "[\n" + obj.map(x => innerIndent + jsStringify(x, innerIndent)).join(",\n") + "\n" + indent + "]";
    } else if (typeof obj === "object" && obj !== null) {
        const innerIndent = indent + "  ";
        const props = Object.keys(obj).map(k => {
            return innerIndent + k + ": " + jsStringify(obj[k], innerIndent);
        });
        return "{\n" + props.join(",\n") + "\n" + indent + "}";
    }
    return obj;
}

const newDString = "const D = " + jsStringify(finalD) + ";";

const newContent = content.substring(0, startIndex) + newDString + content.substring(endIndex);

fs.writeFileSync("c:/Sathish/me-new/cloud-guide/qa2.html", newContent);

console.log("Categories counts:");
for (let c of newSections) {
    console.log(c.s, c.items.length);
}
console.log("Done.");
