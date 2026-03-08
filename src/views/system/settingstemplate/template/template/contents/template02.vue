<template>
  <div class="report-container" ref="statisticsRef">
    <!-- 1. 报告标题 -->
    <div class="report-title">
      <h1>"一步法"MTB+NTM鉴定及耐药基因检测报告</h1>
    </div>

    <!-- 2. 样本信息部分 -->
    <table class="info-table">
      <tr class="header-row">
        <th colspan="6">样本信息</th>
      </tr>
      <tr>
        <td colspan="6" class="section-header">受检者信息</td>
      </tr>
      <tr>
        <td class="label" colspan="2">姓名：{{ patient?.name || "" }}</td>
        <td class="label" colspan="2">性别：{{ patient?.gender || "" }}</td>
        <td class="label" colspan="2">年龄：{{ patient?.age || "" }}</td>
      </tr>
      <tr>
        <td class="label" colspan="2">
          住院号/门诊号：{{ patient?.patientId || "" }}
        </td>
        <td class="label" colspan="2">电话：{{ patient?.phone || "" }}</td>
        <td class="label" colspan="2">床号：{{ patient?.bedNumber || "" }}</td>
      </tr>
      <tr>
        <td colspan="6" class="section-header">样本信息</td>
      </tr>
      <tr>
        <td class="label" colspan="2">
          样本编号：{{ sample?.sampleNo || "" }}
        </td>
        <td class="label" colspan="2">
          检测项目：{{ sample?.testItem || "" }}
        </td>
        <td class="label" colspan="2">
          样本类型：{{ sample?.sampleType || "" }}
        </td>
      </tr>
      <tr>
        <td class="label" colspan="2">
          采样日期：{{ sample?.collectionDate || "" }}
        </td>
        <td class="label" colspan="2">
          接收日期：{{ sample?.receiveDate || "" }}
        </td>
        <td class="label" colspan="2">
          样本体积：{{ sample?.sampleVolume || "" }}
        </td>
      </tr>

      <tr>
        <td colspan="6" class="section-header">送检方信息</td>
      </tr>
      <tr>
        <td colspan="6" class="label">
          送检医院：{{ sender?.hospital || "" }}
        </td>
      </tr>
      <tr>
        <td colspan="2" class="label">
          送检科室：{{ sender?.department || "" }}
        </td>
        <td colspan="4" class="label">送检医生：{{ sender?.doctor || "" }}</td>
      </tr>

      <tr>
        <td colspan="6" class="section-header">临床信息</td>
      </tr>
      <tr>
        <td colspan="6" class="label">
          临床病原检测结果：{{ clinical?.result || "" }}
        </td>
      </tr>
      <tr>
        <td colspan="6" class="label">
          临床表现：{{ clinical?.symptoms || "" }}
        </td>
      </tr>
    </table>

    <!-- 3. 检测结果表 -->
    <table class="table-center" style="margin-bottom: 0">
      <tr class="header-row">
        <th colspan="6">检测结果</th>
      </tr>

      <tr>
        <th>微生物类型</th>
        <th>属名</th>
        <th>种名</th>
        <th>均一化序列数</th>
        <th>微生物估测浓度等级</th>
        <th>致病性分类</th>
      </tr>

      <!-- 检出细菌列表 -->
      <tr class="sub-header">
        <td colspan="6">1、检出分枝杆菌列表</td>
      </tr>
      <template v-if="bacteriaList.length > 0">
        <tr v-for="(item, index) in bacteriaList" :key="'bacteria_' + index">
          <td>{{ item.type }}</td>
          <td v-html="item.genus"></td>
          <td v-html="item.species"></td>
          <td>{{ levellingReadsCustomRender(item.normalizedSeq as string) }}</td>
          <td>{{ item.concentration }}</td>
          <td>{{ item.pathogenicity }}</td>
        </tr>
      </template>
      <tr v-else>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>

      <!-- 检出真菌列表 -->
      <tr class="sub-header">
        <td colspan="6">2、检出细菌列表</td>
      </tr>
      <template v-if="fungiList.length > 0">
        <tr v-for="(item, index) in fungiList" :key="'fungi_' + index">
          <td>{{ item.type }}</td>
          <td v-html="item.genus"></td>
          <td v-html="item.species"></td>
          <td>{{ levellingReadsCustomRender(item.normalizedSeq as string) }}</td>
          <td>{{ item.concentration }}</td>
          <td>{{ item.pathogenicity }}</td>
        </tr>
      </template>
      <tr v-else>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>

      <!-- 检出病毒列表 -->
      <tr class="sub-header">
        <td colspan="6">3、检出真菌列表</td>
      </tr>
      <template v-if="virusList.length > 0">
        <tr v-for="(item, index) in virusList" :key="'virus_' + index">
          <td>{{ item.type }}</td>
          <td v-html="item.genus"></td>
          <td v-html="item.species"></td>
          <td>{{ levellingReadsCustomRender(item.normalizedSeq as string) }}</td>
          <td>{{ item.concentration }}</td>
          <td>{{ item.pathogenicity }}</td>
        </tr>
      </template>
      <tr v-else>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>

      <!-- 检出菌属及其他病原体列表 -->
      <tr class="sub-header">
        <td colspan="6">4、检出菌属列表</td>
      </tr>
      <template v-if="otherPathogenList.length > 0">
        <tr v-for="(item, index) in otherPathogenList" :key="'other_' + index">
          <td>{{ item.type }}</td>
          <td v-html="item.genus"></td>
          <td v-html="item.species"></td>
          <td>{{ levellingReadsCustomRender(item.normalizedSeq as string) }}</td>
          <td>{{ item.concentration }}</td>
          <td>{{ item.pathogenicity }}</td>
        </tr>
      </template>
      <tr v-else>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>

      <!-- 说明文字 -->
      <tr>
        <td colspan="6" class="note">
          <p>
            <b>均一化序列数：</b>每500K的原始序列中含有该微生物的序列数，均一化序列数越高，则样本含有该微生物的确定性越高。
          </p>
          <p>
            <b>微生物估测浓度等级：</b>通过生物信息学方法计算样本中微生物含量，并非绝对定量，仅供临床参考，高（≥1x10^5copies/mL），中（1x10^2-1x10^5copies/mL），低（≤1x10^2copies/mL）。
          </p>
          <p>
            <b>致病性A类：</b>在呼吸道标本中为专性致病病原体,或呼吸道临床常见致病病原体。
          </p>
          <p>
            <b>致病性B类：</b>在呼吸道标本中为机会性(条件性)致病病原体,患者存在全身或局部免疫低下/受损/缺陷、呼吸道屏障功能破坏或呼吸道微生态失衡时可能导致感染,请结合患者临床实际情况综合考虑。
          </p>
          <p>
            <b>备注：</b>上述微生物分类仅供临床参考，对微生物的最终释义以临床为准。
          </p>
        </td>
      </tr>
    </table>

    <!-- 4. 检出结核分枝杆菌复合群耐药基因列表 -->
    <table class="drug-resistance-table table-center" style="margin-bottom: 0">
      <tr class="header-row">
        <th colspan="6">检出结核分枝杆菌复合群耐药基因列表</th>
      </tr>
      <tr>
        <th>基因名称</th>
        <th>突变类型</th>
        <th>突变频率</th>
        <th colspan="2">临床意义</th>
        <th>结果提示</th>
      </tr>
      <template v-if="resistanceGeneList.length > 0">
        <tr v-for="(item, index) in resistanceGeneList" :key="'gene_' + index">
          <td>{{ item.drugGene }}</td>
          <td>{{ item.mutationClass }}</td>
          <td>{{ `${item.mutationRate}%` }}</td>
          <td colspan="2">{{ item.annotation }}</td>
          <td>{{ item.whoRating }}</td>
        </tr>
      </template>
      <tr v-else>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td colspan="2">-</td>
        <td>-</td>
      </tr>
    </table>

    <!-- 5. 检出非结核分枝杆菌复合群耐药基因列表-->
    <table class="mutation-table table-center" style="margin-bottom: 0">
      <tr class="header-row">
        <th colspan="6">
          检出非结核分枝杆菌复合群耐药基因列表
        </th>
      </tr>
      <tr>
        <th>基因名称</th>
        <th>突变类型</th>
        <th>突变频率</th>
        <th colspan="2">临床意义</th>
        <th>关联物种</th>
      </tr>
      <template v-if="resistanceGeneList2.length > 0">
        <tr v-for="(item, index) in resistanceGeneList2" :key="'gene2_' + index">
          <td>{{ item.drugGene }}</td>
          <td>{{ item.mutationClass }}</td>
          <td>{{ `${item.mutationRate}%` }}</td>
          <td colspan="2">{{ item.annotation }}</td>
          <td>{{ item.whoRating }}</td>
        </tr>
      </template>
      <tr v-else>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td colspan="2">-</td>
        <td>-</td>
      </tr>
      <tr>
        <td colspan="6" class="note">
          <p>
            <b>突变类型:</b>指耐药基因上发生突变的类型，包括突变发生的位置和具体突变形式。突变类型的命名方式参考了 HGVS(Human Genome Variation Society，人类基因组变异协会)标准命名方式。
          </p>
          <p>
            <b>突变频率:</b>该位点突变序列数占该位点总序列数的比例，频率范围为[0%,100%，该突变频率并非精准定量结果，仅供参考。
          </p>
          <p>
            <b>结果提示:</b>WHO 2023 年发布的《结核分枝杆菌耐药相关基因突变目录(第2版)》中对而药突变分级进行了划定，该分级可以反映耐药突变与耐药表型的关联程度。“WH0 1 级”(Groupl:Associated with resistance)是指耐药突变与耐药相关;"WHO 2 级”(Group2: Associated wthresistance-interim)是指耐药突变暂定与耐药相关，关联强度较1级有所下降;“WHO 3 级”(Group3: Uncetain signifcance)是指通过现有研究无法确定耐药突变是否与表型存在关联；“N/A”表示目前缺乏WHO的评级数据支持，但该基因突变被结核耐药基因公共数据库收录或高影响因子论文中有发现。
          </p>
          <p>
            <b>关联物种:</b>指与该耐药位点相关联的微生物物种。
          </p>
        </td>
      </tr>
    </table>

    <!-- 6. 异烟肼 -->
    <table class="negative-table table-center" style="margin-bottom: 0">
      <tr class="header-row">
        <th colspan="5">检出异烟肼代谢相关基因NAT2基因检测结果列表</th>
      </tr>
      <tr>
        <th>基因型</th>
        <th>核苷酸突变</th>
        <th>氨基酸突变</th>
        <th>代谢类型</th>
        <th>结果提示</th>
      </tr>
      <template v-if="mutationList.length > 0">
        <tr v-for="(item, index) in mutationList" :key="'mutation_' + index">
          <td>{{ item.geneName }}</td>
          <td v-html="item.dntMutation"></td>
          <td>{{ item.aminoMutation }}</td>
          <td>{{ item.phenotype }}</td>
          <td>{{ item.result }}</td>
        </tr>
      </template>
      <tr v-else>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>
      <tr>
        <th colspan="5">异烟肼检测结果用药建议</th>
      </tr>
      <tr>
        <td colspan="5" class="note">
          <p>
            慢代谢型，NAT2基因突变导致异烟肼代谢减慢，异烟肼短期内在人体内积累，血药浓度高，杀菌效果好，但异烟肼高浓度积累会对肝脏造成损伤，建议考虑治疗时降低用量至0.5倍的标准剂量;也可综合患者的身体指标、病程情况，使用标准剂量的异烟肼，同步测定患者的异烟肼血药浓度，并根据具体情况进行调整。
          </p>
          <p style="text-align: right;">
            ----《结核病患者N-乙酰基转移酶2编码基因多态性检测与异烟肼合理用药专家共识》
          </p>
          <p>
            检测结果说明:<br/>
            1.若基因型为双杂合或三杂合的情况，其代谢类型需通过双亲的NAT2基因型来判断为中间代谢型还是慢代谢型。<br/>
            2.N-乙酰基转移酶2(NAT2)属于Ⅱ相解毒酶。NAT2基因位于人类第8对染色体短臂2区2带(8p22)，NAT2存在7个SNP位点，形成几十种等位基因，其中*4.*12、*13为快乙酰化(F)等位基因;*5、*5B、*6、*6A、*7、*7B、为慢乙酰化(S)等位基因，据此可将人群分为三种基因类型:快代谢型、中间代谢性和慢代谢性 。这三种类型人群的血药浓度存在明显差异。<br/>
            3.以上用药建议仅供临床医生参考，医生应综合患者的生理及病理情况，在安全有效的范围内确定治疗方案。
          </p>
        </td>
      </tr>
    </table>

    <!-- 7. 疑似病原体 -->
    <table class="negative-table table-center" style="margin-bottom: 0">
      <tr class="header-row">
        <th colspan="6">疑似病原体</th>
      </tr>
      <tr>
        <th>微生物类型</th>
        <th>属名</th>
        <th>种名</th>
        <th>均一化序列数</th>
        <th>微生物估测浓度等级</th>
        <th>致病性分类</th>
      </tr>
      <template v-if="suspectedPathogenList.length > 0">
        <tr v-for="(item, index) in suspectedPathogenList" :key="'suspected_' + index">
          <td>{{ item.type }}</td>
          <td v-html="item.genus"></td>
          <td v-html="item.species"></td>
          <td>{{ levellingReadsCustomRender(item.normalizedSeq as string) }}</td>
          <td>{{ item.concentration }}</td>
          <td>{{ item.pathogenicity }}</td>
        </tr>
      </template>
      <tr v-else>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>
      <tr>
        <td colspan="6" class="note">
          <p>
            <b>注：</b>疑似病原体列表中报出的病原体的含量已经低于本方法的最低检测限。所列出的结果有较高的假阳性可能。对于本表中呈现的病原体，需要医生结合临床表现谨慎判断是否确实可能存在该病原体感染。如果列表中存在临床高度怀疑的致病病原体，我们建议临床重新取样，或使用其它检测方法进行验证性诊断。
          </p>
        </td>
      </tr>
    </table>


    <div class="pdf-page-break"></div>

    <div class="before-break clinical-advice-page">
      <!-- 临床建议部分 -->
      <table style="margin-bottom: 0" class="clinical-advice">
        <tr class="header-row">
          <th colspan="4">临床建议</th>
        </tr>
        <template v-if="clinicalAdviceList.length > 0">
          <tr v-for="(item, index) in clinicalAdviceList" :key="'advice_' + index">
            <td style="text-align: center">{{ item.pathogen }}</td>
            <td colspan="3">{{ item.advice }}</td>
          </tr>
        </template>
        <tr v-else>
          <td style="text-align: center">-</td>
          <td colspan="3">-</td>
        </tr>
      </table>

      <!-- 签名栏 -->
      <div class="signature-row-container">
        <div class="signature-row">
          <div class="signature-item" style="position: relative">
            检测者：
            <div style="
                position: absolute;
                bottom: 1px;
                left: 60px;
                width: 100px;
                height: 50px;
              ">
              <img :src="sign?.fileList[0]" style="width: 100%; height: 100%" />
            </div>
          </div>
          <div class="signature-item" style="position: relative">
            结果一审：
            <div style="
                position: absolute;
                bottom: 1px;
                left: 70px;
                width: 100px;
                height: 50px;
              ">
              <img :src="firstSign?.fileList[0]" style="width: 100%; height: 100%" />
            </div>
          </div>
          <div class="signature-item" style="position: relative">
            结果二审 ：
            <div style="
                position: absolute;
                bottom: 1px;
                left: 75px;
                width: 100px;
                height: 50px;
              ">
              <img :src="secondSign?.fileList[0]" style="width: 100%; height: 100%" />
            </div>
          </div>
          <div class="signature-item" style="position: relative">
            报告日期：{{ report.reportDate || "" }}

            <div style="
                position: absolute;
                bottom: 23px;
                left: 16px;
                width: 100px;
                height: 100px;
              ">
              <img :src="unitSeal?.fileList[0]" style="width: 100%; height: 100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pdf-page-break"></div>
    <!-- 检测信息部分 -->
    <table class="quality-control table-center" style="margin-bottom: 0">
      <tr class="header-row">
        <th colspan="4">检测质控</th>
      </tr>
      <tr>
        <th>测序总序列数</th>
        <th>阴性对照</th>
        <th>内参</th>
        <th>Q30比率 (%)</th>
      </tr>
      <tr>
        <td>{{ qualityControl.totalSequences || "合格" }}</td>
        <td>{{ qualityControl.negativeControl || "合格" }}</td>
        <td>{{ qualityControl.internalReference || "合格" }}</td>
        <td>{{ qualityControl.q30Ratio || "合格" }}</td>
      </tr>
    </table>

    <!-- 检测说明部分 -->
    <table class="test-description" style="margin-bottom: 0">
      <tr class="header-row">
        <th>检测说明</th>
      </tr>
      <tr>
        <td>
          <ol>
            <li>
              本检测使用靶向高通量测序技术(targeted
              NGS,tNGS)对多种微生物进行平行检测，通过生物信息技术分析鉴定样本中可疑病原体，辅助临床医生进行综合分析判断和制定个体化精准治疗方案。
            </li>
            <li>
              本检测是基于现有的病原体基因组或者基因数据库设计捕获探针。不排除由于受检人携带的病原体经过突变，导致探针无法捕获或者捕获效率低，从而导致漏检的可能。
            </li>
            <li>
              耐药基因的基因型与表型之间可能存在差异，即使耐药基因检测结果阳性，也不能确认微生物对相应药物一定耐药，本耐药基因检测结果仅供临床医生参考。
            </li>
            <li>
              检测结果只对本次样本负责，检测结果仅用于病原筛查，相关检测结果仅供临床医生参考，不作为最终诊断结果，由于技术局限性测序本身也可能存在一些假阳性和假阴性，相应结果请临床结合患者的具体临床表现和检查结果综合判断。
            </li>
            <li>
              本检测的时效性：从严格意义上讲本检测只能反映检测样本采集日时患者体内病原菌的情况；如果样本采集日距离现在的时间过长，则该检测结果并不能完全作为制定当前治疗方案的参考。本检验机构会对该结果保密并依法保护用户的隐私，由受检者个人原因导致的信息外泄，本检验机构不承担相应责任。
            </li>
          </ol>
        </td>
      </tr>
    </table>

    <!-- 参考文献部分 -->
    <table class="references" style="margin-bottom: 0">
      <tr class="header-row">
        <th>参考文献</th>
      </tr>
      <tr>
        <td>
          <ol>
            <li>
              Henan Li,et al.Detection of Pulmonary infectious Pathogens from
              Lung Biopsy Tissues by Metagenomic Next-Generation Sequencing.
              Front. Cell. Infect. Microbiol.2018.8:205.
            </li>
            <li>
              Wafaa Jamal,et al.Evaluation of Curetis Unyvero,a Multiplex
              PCR-Based Testing System for Rapid Detection of Bacteria and
              Antibiotic Resistance and lmpact of the Assay on Management of
              Severe Nosocomial Pneumonia.J.Clin Microbiol.2014.52:2487-2492.
            </li>
            <li>
              Yun Long,et al Diagnosis of Sepsis with Cell-free DNA by
              Next-Generation Sequencing Technology in ICU Patients.Arch. Med.
              Res.2016.47:365-371.
            </li>
            <li>
              M.J.Loeffelholz,et al.Comparison of the FilmArray Respiratory
              Panel and ProdesseRealTime PCR Assays for Detection of Respiratory
              Pathogens.J.Clin Microbiol.2011.49:4083-4088
            </li>
            <li>
              Chiara Ferrario,et al.Next generation sequencing-based multigene
              panel for high throughput detection of foodborne
              pathogens.Int.J.Food Microbiol.2017.256:20-29.
            </li>
            <li>
              P,Parize,et al.Untargeted nextgeneration sequencing-based
              first-line diagnosis of infection in immunocompromised adults:a
              multicentre,blinded,prospective study,Clin. Microbiol
              Infec.2017.23:574.e1-574.e6.
            </li>
            <li>
              Hansong Chae,et al.Development of a One-Step Multiplex PCR Assay
              for Differential Detection of Major Mycobacterium Species J.Clin
              Microbiol,2017,55.2736-2751.
            </li>
            <li>
              Anne J.Blaschke,et al.Retrospective Evaluation of infants Aged
              1-60 Days With Residual CSF Tested Using the FilmArray 2
              Meningitis/Encephalitis(ME) Panel J.Clin Microbiol.2018.10.1128.
            </li>
            <li>靶向高通量测序在感染性疾病中应用与实践专家共识 2024</li>
            <li>靶向高通量测序技术应用于感染性疾病中国专家共识 2024</li>
            <li>靶向二代测序在感染性疾病诊疗中的规范化应用专家共识 2025</li>
            <li>《人间传染的病原微生物目录》（2023版）</li>
            <li>临床微生物学手册 第12版</li>
            <li>国家抗微生物治疗指南 第3版2023</li>
            <li>结核病患者N-乙酰基转移酶2编码基因多态性检测与异烟肼合理用药专家共识.2021</li>
            <li>非结核分枝杆菌病分子生物学诊断专家共识.2025</li>
            <li>WHO结核耐药指南.2024</li>
            <li>WHO推荐结核分枝杆菌复合体突变目景及其与耐药性的关系，第二版.2023</li>
            <li>高通量测序技术在分枝杆菌病诊断中的应用专家共识.2023</li>
            <li>抗结核药物超说明书用法专家共识.2023</li>
            <li>综合医院结核分枝杆菌感染实验室检查共识.2022</li>
          </ol>
        </td>
      </tr>
    </table>

    <!-- 病原体检测结果详细列表 -->
    <div class="pdf-page-break">
    </div>
    <table class="pathogen-detail-table table-center" ref="pathogenDetailTableRef1">
      <tr class="header-row">
        <th colspan="3">分枝杆菌分群</th>
        <th colspan="2">中文名</th>
        <th colspan="3">拉丁名</th>
      </tr>
      <!-- DNA病毒类 -->
      <tr>
        <td rowspan="9" colspan="3">结核分枝杆菌复合群</td>
        <td colspan="2" class="mark">结核分枝杆菌复合群</td>
        <td colspan="3">Mycobacterium tuberculosis complex</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">人结核分枝杆菌</td>
        <td colspan="3">Mycobacterium tuberculosis</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">牛分枝杆菌</td>
        <td colspan="3">Mycobacterium bovis</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">非洲分枝杆菌</td>
        <td colspan="3">Mycobacterium africanum</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">田鼠分枝杆菌</td>
        <td colspan="3">Mycobacterium microti</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">卡内蒂分枝杆菌</td>
        <td colspan="3">Mycobacterium canettii</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">山羊分枝杆菌</td>
        <td colspan="3">Mycobacterium caprae</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">海豹分枝杆菌</td>
        <td colspan="3">Mycobacterium pinnipedii</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">卡介苗</td>
        <td colspan="3">Mycobacterium tuberculosis variant bovis BCG</td>
      </tr>

      <!-- RNA病毒 -->
      <tr>
        <td colspan="3">麻风分枝杆菌</td>
        <td colspan="2" class="mark">麻风分枝杆菌</td>
        <td colspan="3">Mycobacterium leprae</td>
      </tr>

      <tr>
        <td rowspan="9" colspan="3">Ⅰ组：光产色菌<br />(photochromogens)</td>
        <td colspan="2" class="mark">日内瓦分枝杆菌</td>
        <td colspan="3">Mycobacterium genavense</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">三重分枝杆菌</td>
        <td colspan="3">Mycobacterium triplex</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">慢生黄分枝杆菌</td>
        <td colspan="3">Mycobacterium lentiflavum</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">堪萨斯分枝杆菌</td>
        <td colspan="3">Mycobacterium kansasii</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">海分枝杆菌</td>
        <td colspan="3">Mycobacterium marinum</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">猿分枝杆菌</td>
        <td colspan="3">Mycobacterium simiae</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">隐藏分枝杆菌</td>
        <td colspan="3">Mycobacterium celatum</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">熊本分枝杆菌</td>
        <td colspan="3">Mycobacterium kumamotonense</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">猿猴分枝杆菌复合群</td>
        <td colspan="3">Mycobacterium simiae complex</td>
      </tr>

      <tr>
        <td rowspan="4" colspan="3">Ⅱ组：暗产色菌<br />(scotochromogens)</td>
        <td colspan="2" class="mark">瘰疬分枝杆菌</td>
        <td colspan="3">Mycobacterium scrofulaceum</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">戈登分枝杆菌</td>
        <td colspan="3">Mycobacterium gordonae</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">亚洲分枝杆菌</td>
        <td colspan="3">Mycobacterium asiaticum</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">苏尔加分枝杆菌</td>
        <td colspan="3">Mycobacterium szulgai</td>
      </tr>

      <tr>
        <td rowspan="16" colspan="3">Ⅲ组：不产色菌<br />(non-photochromogens)</td>
        <td colspan="2" class="mark">鸟分枝杆菌</td>
        <td colspan="3">Mycobacterium avium</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">胞内分枝杆菌</td>
        <td colspan="3">Mycobacterium intracellulare</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">鸟-胞内分枝杆菌复合群</td>
        <td colspan="3">Mycobacterium avium complex</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">奇美拉分枝杆菌</td>
        <td colspan="3">Mycobacterium chimaera</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">哥伦比亚分枝杆菌</td>
        <td colspan="3">Mycobacterium colombiense</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">马萨分枝杆菌</td>
        <td colspan="3">Mycobacterium marseillense</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">副胞内分枝杆菌</td>
        <td colspan="3">Mycobacterium paraintracellulare</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">胃分枝杆菌</td>
        <td colspan="3">Mycobacterium gastri</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">玛尔摩分枝杆菌</td>
        <td colspan="3">Mycobacterium malmoense</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">蟾分枝杆菌</td>
        <td colspan="3">Mycobacterium xenopi</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">溃疡分枝杆菌</td>
        <td colspan="3">Mycobacterium ulcerans</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">嗜血分枝杆菌</td>
        <td colspan="3">Mycobacterium haemophilum</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">施氏分枝杆菌</td>
        <td colspan="3">Mycobacterium shimoidei</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">波西米亚分枝杆菌</td>
        <td colspan="3">Mycobacterium bohemicum</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">次要分枝杆菌</td>
        <td colspan="3">Mycobacterium triviale</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">土分枝杆菌</td>
        <td colspan="3">Mycolicibacter terrae</td>
      </tr>
    </table>

    <div class="pdf-page-break">
    </div>
    <table class="pathogen-detail-table table-center" ref="pathogenDetailTableRef2">
      <tr class="header-row">
        <th colspan="3">分枝杆菌分群</th>
        <th colspan="2">中文名</th>
        <th colspan="3">拉丁名</th>
      </tr>
      <tr>
        <td rowspan="16" colspan="3">Ⅳ组：快速生长型分枝杆菌<br />(rapidly growing mycobacteria，RGM)</td>
        <td colspan="2" class="mark">龟分枝杆菌</td>
        <td colspan="3">Mycobacterium chelonae</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">脓肿分枝杆菌</td>
        <td colspan="3">Mycobacteroides abscessus</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">脓肿分枝杆菌博莱亚种</td>
        <td colspan="3">Mycobacterium abscessus subsp.bolletii</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">脓肿分枝杆菌脓肿亚种</td>
        <td colspan="3">Mycobacterium abscessus subsp. abscessus</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">脓肿分枝杆菌马赛亚种</td>
        <td colspan="3">Mycobacterium abscessus subsp.massiliense</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">菌血症分枝杆菌</td>
        <td colspan="3">Mycobacterium bacteremicum</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">偶发分枝杆菌</td>
        <td colspan="3">Mycobacterium fortuitum</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">草分枝杆菌</td>
        <td colspan="3">Mycolicibacterium phlei</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">耻垢分枝杆菌</td>
        <td colspan="3">Mycobacterium smegmatis</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">新金色分枝杆菌</td>
        <td colspan="3">Mycolicibacterium neoaurum</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">抗热分枝杆菌</td>
        <td colspan="3">Mycolicibacterium thermoresistibile</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">母牛分枝杆菌</td>
        <td colspan="3">Mycolicibacterium vaccae</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">外来分枝杆菌</td>
        <td colspan="3">Mycolicibacterium peregrinum</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">玛格丽特分枝杆菌</td>
        <td colspan="3">Mycolicibacterium mageritense</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">产黏液分枝杆菌</td>
        <td colspan="3">Mycobacterium mucogenicum</td>
      </tr>
      <tr>
        <td colspan="2" class="mark">免疫原分枝杆菌</td>
        <td colspan="3">Mycobacteroides immunogenum</td>
      </tr>
    </table>

    <!-- 耐药基因检测详细列表 -->
    <table class="resistance-gene-table table-center" style="margin-bottom: 0" ref="pathogenDetailTableRef3">
      <tr class="header-row">
        <th >分类</th>
        <th colspan="3">菌种中文名</th>
      </tr>
      <tr>
        <td rowspan="5">真菌</td>
        <td class="mark">耶氏肺孢子菌</td>
        <td class="mark">白念珠菌</td>
        <td class="mark">微小根毛霉</td>
      </tr>
      <tr>
        <td class="mark">黄曲霉</td>
        <td class="mark">卷枝毛霉菌</td>
        <td class="mark">尖端赛多孢子菌</td>
      </tr>
      <tr>
        <td class="mark">土曲霉</td>
        <td class="mark">总状毛霉</td>
        <td class="mark">波萨达斯球孢子菌</td>
      </tr>
      <tr>
        <td class="mark">黑曲霉</td>
        <td class="mark">小孢根霉</td>
        <td class="mark">马尔尼菲篮状菌</td>
      </tr>
      <tr>
        <td class="mark">烟曲霉</td>
        <td class="mark">伞状横梗霉</td>
        <td class="mark">荚膜组织胞浆菌</td>
      </tr>

      <tr>
        <td rowspan="3">革兰氏阳性菌</td>
        <td class="mark">金黄色葡萄球菌</td>
        <td class="mark">无乳链球菌</td>
        <td class="mark">皮疽诺卡菌</td>
      </tr>
      <tr>
        <td class="mark">肺炎链球菌</td>
        <td class="mark">巴西诺卡菌</td>
        <td class="mark">脓肿诺卡菌</td>
      </tr>
      <tr>
        <td class="mark">停乳链球菌</td>
        <td class="mark">星型诺卡菌</td>
        <td class="mark">盖尔森基兴诺卡菌</td>
      </tr>

      <tr>
        <td rowspan="5">革兰氏阴性菌</td>
        <td class="mark">肺炎克雷伯菌</td>
        <td class="mark">流感嗜血杆菌</td>
        <td class="mark">嗜麦芽窄食单胞菌</td>
      </tr>
      <tr>
        <td class="mark">大肠埃希菌</td>
        <td class="mark">铜绿假单胞菌</td>
        <td class="mark">鼻疽伯克霍尔德菌</td>
      </tr>
      <tr>
        <td class="mark">产气克雷伯菌</td>
        <td class="mark">鲍曼不动杆菌</td>
        <td class="mark">弗劳地枸橼酸杆菌复合群</td>
      </tr>
      <tr>
        <td class="mark">阴沟肠杆菌复合群</td>
        <td class="mark">奇异变形杆菌</td>
        <td class="mark">粘质沙雷氏菌</td>
      </tr>
      <tr>
        <td class="mark">嗜肺军团菌</td>
        <td></td>
        <td></td>
      </tr>

      <tr>
        <td rowspan="2">菌属</td>
        <td class="mark">布鲁菌属</td>
        <td class="mark">根毛霉属</td>
        <td class="mark">沙雷氏菌属</td>
      </tr>
      <tr>
        <td class="mark">曲霉属</td>
        <td class="mark">隐球菌属</td>
        <td class="mark">毛霉属</td>
      </tr>
    </table>

    <div class="pdf-page-break">
    </div>
    <!-- 突变体详细列表 -->
    <table class="mutation-detail-table table-center" style="margin-bottom: 0">
      <tr class="header-row">
        <th>
          物种
        </th>
        <th colspan="4">
          药物名称
        </th>
        <th>
          耐药基因
        </th>
        <th>
          位点数
        </th>
      </tr>
      <tr>
        <td rowspan="31">结核分枝杆菌复合群</td>
        <td rowspan="6">一线药物</td>
        <td colspan="3">利福平</td>
        <td>rpoB</td>
        <td>90</td>
      </tr>
      <tr>
        <td colspan="3">乙胺丁醇</td>
        <td>embB</td>
        <td>22</td>
      </tr>
      <tr>
        <td rowspan="3" colspan="3">异烟肼</td>
        <td>katG</td>
        <td>191</td>
      </tr>
      <tr>
        <td>inhA</td>
        <td>6</td>
      </tr>
      <tr>
        <td>ahpC</td>
        <td>8</td>
      </tr>
      <tr>
        <td colspan="3">吡嗪酰胺</td>
        <td>pncA</td>
        <td>200</td>
      </tr>

      <tr>
        <td rowspan="25">二线药物</td>
        <td colspan="3">链霉素、卡那霉素、阿米卡星、卷曲霉素</td>
        <td>rrs</td>
        <td>11</td>
      </tr>
      <tr>
        <td colspan="3">卷曲霉素</td>
        <td>tlyA</td>
        <td>61</td>
      </tr>
      <tr>
        <td colspan="3">链霉素</td>
        <td>rpsL</td>
        <td>7</td>
      </tr>
      <tr>
        <td colspan="3">链霉素</td>
        <td>gid</td>
        <td>119</td>
      </tr>
      <tr>
        <td colspan="3">卡那霉素、阿米卡星</td>
        <td>eis</td>
        <td>7</td>
      </tr>
      <tr>
        <td colspan="3">贝达喹啉、氯法齐明</td>
        <td>Rv0678</td>
        <td>176</td>
      </tr>
      <tr>
        <td colspan="3">贝达喹啉、氯法齐明</td>
        <td>Rv1979c</td>
        <td>3</td>
      </tr>
      <tr>
        <td colspan="3">贝达喹啉、氯法齐明</td>
        <td>pepQ</td>
        <td>8</td>
      </tr>
      <tr>
        <td colspan="3">贝达喹啉</td>
        <td>atpE</td>
        <td>7</td>
      </tr>
      <tr>
        <td colspan="3">氟喹诺酮</td>
        <td>gyrA</td>
        <td>17</td>
      </tr>
      <tr>
        <td colspan="3">氟喹诺酮</td>
        <td>gyrB</td>
        <td>13</td>
      </tr>
      <tr>
        <td colspan="3">利奈唑胺</td>
        <td>rrl</td>
        <td>11</td>
      </tr>
      <tr>
        <td colspan="3">利奈唑胺</td>
        <td>rplC</td>
        <td>5</td>
      </tr>
      <tr>
        <td colspan="3">德拉马尼</td>
        <td>fgd1</td>
        <td>3</td>
      </tr>
      <tr>
        <td colspan="3">德拉马尼</td>
        <td>fbiC</td>
        <td>157</td>
      </tr>
      <tr>
        <td colspan="3">德拉马尼</td>
        <td>Rv2983</td>
        <td>43</td>
      </tr>
      <tr>
        <td colspan="3">德拉马尼</td>
        <td>fbiA</td>
        <td>32</td>
      </tr>
      <tr>
        <td colspan="3">德拉马尼</td>
        <td>fbiB</td>
        <td>48</td>
      </tr>
      <tr>
        <td colspan="3">德拉马尼</td>
        <td>ddn</td>
        <td>242</td>
      </tr>
      <tr>
        <td colspan="3">环丝氨酸</td>
        <td>ald</td>
        <td>4</td>
      </tr>
      <tr>
        <td colspan="3">环丝氨酸</td>
        <td>alr</td>
        <td>9</td>
      </tr>
      <tr>
        <td colspan="3">乙硫异烟胺</td>
        <td>inhA</td>
        <td>6</td>
      </tr>
      <tr>
        <td colspan="3">乙硫异烟胺</td>
        <td>ethA</td>
        <td>225</td>
      </tr>
      <tr>
        <td colspan="3">对氨基水杨酸钠</td>
        <td>folC</td>
        <td>7</td>
      </tr>
      <tr>
        <td colspan="3">对氨基水杨酸钠</td>
        <td>thyA</td>
        <td>7</td>
      </tr>

      <tr>
        <td>麻风分枝杆菌</td>
        <td colspan="4">利福平</td>
        <td>rpoB</td>
        <td>2</td>
      </tr>

      <tr>
        <td rowspan="12">NTM</td>
        <td colspan="4">链霉素、卡那霉素、阿米卡星、卷曲霉素</td>
        <td>rrs</td>
        <td>4</td>
      </tr>
      <tr>
        <td colspan="4">大环内脂类</td>
        <td>rrl</td>
        <td>15</td>
      </tr>
      <tr>
        <td colspan="4">大环内酯类</td>
        <td>erm</td>
        <td>1</td>
      </tr>
      <tr>
        <td colspan="4">氟喹诺酮</td>
        <td>gyrA</td>
        <td>6</td>
      </tr>
      <tr>
        <td colspan="4">利福平</td>
        <td>rpoB</td>
        <td>3</td>
      </tr>
      <tr>
        <td colspan="4">利奈唑胺</td>
        <td>rplC</td>
        <td>1</td>
      </tr>
      <tr>
        <td colspan="4">利奈唑胺</td>
        <td>MAB_4384</td>
        <td>5</td>
      </tr>
      <tr>
        <td colspan="4">贝达喹啉</td>
        <td>atpE</td>
        <td>2</td>
      </tr>
      <tr>
        <td colspan="4">替加环素</td>
        <td>rshA</td>
        <td>1</td>
      </tr>
      <tr>
        <td colspan="4">贝达喹啉、氯法齐明</td>
        <td>MAB_2299c</td>
        <td>6</td>
      </tr>
      <tr>
        <td colspan="4">氯法齐明</td>
        <td>MAB_1483</td>
        <td>6</td>
      </tr>
      <tr>
        <td colspan="4">氯法齐明</td>
        <td>MAB_0540</td>
        <td>1</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
// import { downloadImageCanvas } from "@/views/dashboard/analysis/components";
import { ref, onMounted } from "vue";

import {
  CheckTypeEnumMap,
  PathogenTypeEnumMap,
  SampleTypeEnumMap,
  SexEnumMap,
  virulenceTypeEnumMap,
} from "@/enums/customEnum";
import { useRender } from "@/components/Table/src/hooks/useRender";
import { scientificToPower } from "@/utils/custom";
import { AnalysisReportDownloadRespVO } from "@/api/lims/analysisreport/model";
import { inputDomeModel } from "@/views/system/settingstemplatedetail/index.data";

const props = defineProps({
  itemsData: {
    type: Array<inputDomeModel>,
    required: true,
  },
  report: {
    type: Object as PropType<AnalysisReportDownloadRespVO>,
    required: true,
  },
});
// 检测者签名
const sign = ref(props.itemsData.find((item) => item.fields === "sign"));
// 结果一审签名
const firstSign = ref(
  props.itemsData.find((item) => item.fields === "firstSign")
);
// 结果二审签名
const secondSign = ref(
  props.itemsData.find((item) => item.fields === "secondSign")
);

//单位公章
const unitSeal = ref(
  props.itemsData.find((item) => item.fields === "unitSeal")
);

// console.log("props.report", props.report);

// 定义数据模型
const patient = ref({
  name: props.report.sample?.examinee?.name,
  gender: SexEnumMap[props.report.sample?.examinee?.sex!],
  age: props.report.sample?.examinee?.age,
  patientId: props.report.sample?.examinee?.patientNumber,
  phone: props.report.sample?.examinee?.phone,
  bedNumber: props.report.sample?.examinee?.bed,
});
console.log(props.report.sample?.samplingDate);
const sample = ref({
  sampleNo: props.report.sample?.sampleCode,
  sampleType: SampleTypeEnumMap[props.report.sample?.sampleType],
  testItem: CheckTypeEnumMap[props.report.sample?.checkType],
  sampleVolume: props.report.sample?.sampleVolume
    ? props.report.sample?.sampleVolume + "mL"
    : "-",
  collectionDate: props.report.sample?.samplingDate
    ? useRender.renderDate(props.report.sample?.samplingDate)
    : "-",
  receiveDate: props.report.sample?.collectDate
    ? useRender.renderDate(props.report.sample?.collectDate)
    : "-",
});

const sender = ref({
  hospital: props.report.sample?.subHospital,
  department: props.report.sample?.subRoom,
  doctor: props.report.sample?.subDoctor,
});

const clinical = ref({
  result: props.report.sample?.clinicalResult?.result,
  symptoms: props.report.sample?.clinicalResult?.diagnosis,
});

// 检测结果表数据
const bacteriaList = ref<
  {
    type: string;
    genus: string;
    species: string;
    normalizedSeq: string | number;
    concentration: string | number;
    pathogenicity: string;
  }[]
>(
  props.report.bacteriaResults.map((item) => {
    return {
      type: item.pathogenType == 0 ? '-' : PathogenTypeEnumMap[item.pathogenType] ? PathogenTypeEnumMap[item.pathogenType] : "-",
      genus: item.pathogenCnGname! + "<br />" + item.pathogenEnGname!,
      species: item.pathogenCnSname! + "<br />" + item.pathogenEnSname!,
      normalizedSeq: item.levellingReads!,
      // concentration: scientificToPower(item.forecastConc!),
      concentration: item.forecastConc!,
      pathogenicity: virulenceTypeEnumMap[item.virulenceType],
    };
  })
);

const fungiList = ref<
  {
    type: string;
    genus: string;
    species: string;
    normalizedSeq: string | number;
    concentration: string | number;
    pathogenicity: string;
  }[]
>(
  props.report.fungusResults.map((item) => {
    return {
      type: item.pathogenType == 0 ? '-' : PathogenTypeEnumMap[item.pathogenType] ? PathogenTypeEnumMap[item.pathogenType] : "-",
      genus: item.pathogenCnGname! + "<br />" + item.pathogenEnGname!,
      species: item.pathogenCnSname! + "<br />" + item.pathogenEnSname!,
      normalizedSeq: item.levellingReads!,
      // concentration: scientificToPower(item.forecastConc!),
      concentration: item.forecastConc!,
      pathogenicity: virulenceTypeEnumMap[item.virulenceType],
    };
  })
);

const virusList = ref<
  {
    type: string;
    genus: string;
    species: string;
    normalizedSeq: string | number;
    concentration: string | number;
    pathogenicity: string;
  }[]
>(
  props.report.virusResults.map((item) => {
    return {
      type: item.pathogenType == 0 ? '-' : PathogenTypeEnumMap[item.pathogenType] ? PathogenTypeEnumMap[item.pathogenType] : "-",
      genus: item.pathogenCnGname! + "<br />" + item.pathogenEnGname!,
      species: item.pathogenCnSname! + "<br />" + item.pathogenEnSname!,
      normalizedSeq: item.levellingReads!,
      // concentration: scientificToPower(item.forecastConc!),
      concentration: item.forecastConc!,
      pathogenicity: virulenceTypeEnumMap[item.virulenceType],
    };
  })
);

const otherPathogenList = ref<
  {
    type: string;
    genus: string;
    species: string;
    normalizedSeq: string | number;
    concentration: string | number;
    pathogenicity: string;
  }[]
>(
  props.report.otherResults.map((item) => {
    return {
      type: item.pathogenType == 0 ? '-' : PathogenTypeEnumMap[item.pathogenType] ? PathogenTypeEnumMap[item.pathogenType] : "-",
      genus: item.pathogenCnGname! + "<br />" + item.pathogenEnGname!,
      species: item.pathogenCnSname! + "<br />" + item.pathogenEnSname!,
      normalizedSeq: item.levellingReads!,
      // concentration: scientificToPower(item.forecastConc!),
      concentration: item.forecastConc!,
      pathogenicity: virulenceTypeEnumMap[item.virulenceType],
    };
  })
);
// 检出耐药基因列表数据-结核相关
const resistanceGeneList = ref<
  {
    drugGene: string;
    mutationClass: string;
    mutationRate: number;
    annotation: string;
    whoRating: string;
  }[]
>(
  props.report.geneResultDOS.map((item) => {
    return {
      drugGene: item.drugGene!,
      mutationClass: item.aminoMutation || item.dntMutation,
      mutationRate: item.mutationRate!,
      annotation: item.annotation!,
      whoRating: item.whoRating!,
    };
  })
);

// 检出耐药基因列表数据-非结核相关
const resistanceGeneList2 = ref<
  {
    drugGene: string;
    mutationClass: string;
    mutationRate: number;
    annotation: string;
    whoRating: string;
  }[]
>(
  props.report.geneResultDOS2.map((item) => {
    return {
      drugGene: item.drugGene!,
      mutationClass: item.aminoMutation || item.dntMutation,
      mutationRate: item.mutationRate!,
      annotation: item.annotation!,
      whoRating: item.whoRating!,
    };
  })
);

// 结核人源基因突变
const mutationList = ref<
  {
    geneName: string;
    dntMutation: string;
    aminoMutation: string;
    phenotype: string;
    result: string;
  }[]
>(
  props.report.mutationDOS.map((item) => {
    return {
      geneName: item.gene!,
      dntMutation: item.dntMutation!,
      aminoMutation: item.aminoMutation!,
      phenotype: item.phenotype!,
      result: item.result!,
    };
  })
);
// 疑似病原体数据
const suspectedPathogenList = ref<
  {
    type: string;
    genus: string;
    species: string;
    normalizedSeq: string | number;
    concentration: string | number;
    pathogenicity: string;
  }[]
>(
  props.report.suspecteds.map((item) => {
    return {
      type: item.pathogenType == 0 ? '-' : PathogenTypeEnumMap[item.pathogenType] ? PathogenTypeEnumMap[item.pathogenType] : "-",
      genus: item.pathogenCnGname! + "<br />" + item.pathogenEnGname!,
      species: item.pathogenCnSname! + "<br />" + item.pathogenEnSname!,
      normalizedSeq: item.levellingReads!,
      // concentration: scientificToPower(item.forecastConc!),
      concentration: item.forecastConc!,
      pathogenicity: virulenceTypeEnumMap[item.virulenceType],
    };
  })
);

const AdviceList: any[] = [];
Object.keys(props.report.clinicals).forEach((key) => {
  AdviceList.push({
    pathogen: key,
    advice: props.report.clinicals[key],
  });
});
// 临床建议数据
const clinicalAdviceList = ref<
  {
    pathogen: string;
    advice: string;
  }[]
>(AdviceList);

// 检测质控数据
const qualityControl = ref({
  totalSequences:
    props.report.qcReport?.rawReadsStatus === 1 ? "合格" : "不合格",
  negativeControl: props.report.qcReport?.waterStatus === 1 ? "合格" : "不合格",
  internalReference:
    props.report.qcReport?.plasmidRateStatus === 1 ? "合格" : "不合格",
  q30Ratio: props.report.qcReport?.qthreeStatus === 1 ? "合格" : "不合格",
});

// 报告信息
const report = ref({
  tester: "张三",
  firstReviewer: "李四",
  secondReviewer: "王五",
  reportDate: new Date().toISOString().slice(0, 10),
});

const pathogenDetailTableRef1 = ref<HTMLTableElement>();
const pathogenDetailTableRef2 = ref<HTMLTableElement>();
const pathogenDetailTableRef3 = ref<HTMLTableElement>();

const statisticsRef = ref();

onMounted(() => {
  pathogenDetailTableRef1.value?.querySelectorAll("td.mark").forEach((td) => {
    const name = td.innerText.trim();
    if (props.report.outPathogenNames.indexOf(name) !== -1) {
      td.classList.add("highlight-cell");
    }
  });
  pathogenDetailTableRef2.value?.querySelectorAll("td.mark").forEach((td) => {
    const name = td.innerText.trim();
    if (props.report.outPathogenNames.indexOf(name) !== -1) {
      td.classList.add("highlight-cell");
    }
  });
  pathogenDetailTableRef3.value?.querySelectorAll("td.mark").forEach((td) => {
    const name = td.innerText.trim();
    if (props.report.outPathogenNames.indexOf(name) !== -1) {
      td.classList.add("highlight-cell");
    }
  });
});


function levellingReadsCustomRender(text: string) {
  //右括号去掉
  if (!isNaN(Number(text))) {
    return Number(text) <= 1 ? 1 : Math.round(Number(text))
  }

  const reads = text.slice(0, text.indexOf('('))
  const mutationRate = text.slice(text.indexOf('('))
  return Number(reads) > 1 ? `${Math.round(reads as unknown as number)}${mutationRate}` : `1${mutationRate}`
}

// 模拟加载数据的方法
// const loadReportData = () => {
//   // 从API获取数据并赋值给上面定义的ref
// };
</script>

<style scoped>
/* 响应式设计 */

.report-container {
  width: 794px;
  padding: 40px 40px 0;
  font-family: "微软雅黑";
  font-size: 14px;
  color: #333;
  background-color: #fff;
}

.report-title {
  margin-bottom: 20px;
  text-align: center;
}

.report-title h1 {
  padding-bottom: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #0056b3;
  border-bottom: 1px solid #0056b3;
}

ol {
  padding: 0 10px 0 20px;
}

table {
  width: 100%;
  margin-bottom: 25px;
  font-size: 11px;
  table-layout: fixed;
  border-spacing: 0;
  border-collapse: collapse;
  break-inside: avoid;
  page-break-inside: avoid;
}

th,
td {
  padding: 2px;
  text-align: left;
  vertical-align: middle;
  border-right: 0.5px solid #b0c4de;
  border-bottom: 0.5px solid #b0c4de;
}

th:first-child,
td:first-child {
  border-left: 0.5px solid #b0c4de;
}

.table-center th,
.table-center td {
  text-align: center;
}

.td-first-item {
  border-left: none !important;
}

th {
  font-weight: bold;
  background-color: #e6f2ff;
}

.header-row {
  font-size: 12px;
  border: none !important;
}

.header-row th {
  padding: 8px;
  font-size: 14px;
  color: white;
  text-align: center;
  background-color: #06c;
  border-color: #06c !important;
}

.sub-header {
  font-weight: bold;
  text-align: left;
  background-color: #e6f2ff;
}

.section-header {
  font-weight: bold;
  background-color: #e6f2ff;
}

.label {
  width: 120px;
  font-weight: bold;
}

.note {
  padding: 10px;
  font-size: 11px;
  color: #666;
  text-align: left !important;
  background-color: #f9f9f9;
}

.signature-row-container {
  position: relative;
  min-height: 150px;
}

.signature-item {
  float: left;
  width: 24.9%;
}

.signature-row {
  position: absolute;
  bottom: 0;
  width: 100%;

  /* background: red; */
}

/* 特定表格样式 */
.info-table {
  margin-bottom: 25px;
}

.result-table,
.drug-resistance-table,
.mutation-table,
.negative-table,
.clinical-advice,
.quality-control,
.test-description,
.references,
.pathogen-detail-table,
.resistance-gene-table,
.mutation-detail-table {
  margin-bottom: 25px;
}

.highlight-cell {
  font-weight: bold;
  color: #f00;
  background: rgb(255 245 245);
}

.pdf-page-break {
  position: relative;
  page-break-before: always;
  break-before: page;

  /* 针对新标准 */

}

</style>