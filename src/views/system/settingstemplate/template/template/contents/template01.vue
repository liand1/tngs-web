<template>
  <div class="report-container" ref="statisticsRef">
    <!-- 1. 报告标题 -->
    <div class="report-title">
      <h1>一步法病原体微生物靶向基因检测（109种）检测报告</h1>
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
        <td colspan="6">1、检出细菌列表</td>
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
        <td colspan="6">2、检出真菌列表</td>
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
        <td colspan="6">3、检出病毒列表</td>
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
        <td colspan="6">4、检出菌属及其他病原体列表</td>
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

    <!-- 4. 检出耐药基因列表 -->
    <table class="drug-resistance-table table-center" style="margin-bottom: 0">
      <tr class="header-row">
        <th colspan="5">检出耐药基因列表</th>
      </tr>
      <tr>
        <th>基因名称</th>
        <th>均一化序列数</th>
        <th>疑似关联病原体</th>
        <th colspan="2">基因说明</th>
      </tr>
      <template v-if="resistanceGeneList.length > 0">
        <tr v-for="(item, index) in resistanceGeneList" :key="'gene_' + index">
          <td>{{ item.geneName }}</td>
          <td>{{ levellingReadsCustomRender(item.normalizedSeq as string) }}</td>
          <td>{{ item.associatedPathogen }}</td>
          <td colspan="2">{{ item.geneDescription }}</td>
        </tr>
      </template>
      <tr v-else>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td colspan="2">-</td>
      </tr>
      <tr>
        <td colspan="5" class="note">
          <p>
            <b>注：</b>检出耐药基因无法定位于其存在于哪种病原体，且耐药基因与表型之间存在差异，检出耐药基因并不能确认该菌对相应药物一定耐药，本检测结果仅供临床参考，请以临床医生指导用药为准。
          </p>
        </td>
      </tr>
    </table>

    <!-- 5. 检出肺炎支原体和百日咳鲍特菌相关耐药基因突变位点列表-->
    <table class="mutation-table table-center" style="margin-bottom: 0">
      <tr class="header-row">
        <th colspan="7">
          检出肺炎支原体和百日咳鲍特菌相关耐药基因突变位点列表
        </th>
      </tr>
      <tr>
        <th>基因名称</th>
        <th>耐药位点检测结果</th>
        <th>均一化序列数</th>
        <th>突变频率</th>
        <th>关联病原体</th>
        <th colspan="2">基因说明</th>
      </tr>
      <template v-if="mutationList.length > 0">
        <tr v-for="(item, index) in mutationList" :key="'mutation_' + index">
          <td>{{ item.geneName }}</td>
          <td>{{ item.resistanceResult }}</td>
          <td>{{ levellingReadsCustomRender(item.normalizedSeq as string) }}</td>
          <td>{{ item.mutationFrequency }}</td>
          <td>{{ item.associatedPathogen }}</td>
          <td colspan="2">{{ item.geneDescription }}</td>
        </tr>
      </template>
      <tr v-else>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td colspan="2">-</td>
      </tr>
      <tr>
        <td colspan="7" class="note">
          <p>
            <b>注：</b>突变频率:该位点突变序列数占该位点总序列数的比例，频率范围为[0%,100%]，该突变频率并非精准定量结果，仅供参考。
          </p>
        </td>
      </tr>
    </table>

    <!-- 6. 疑似病原体 -->
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
          </ol>
        </td>
      </tr>
    </table>

    <!-- 病原体检测结果详细列表 -->
    <div class="pdf-page-break">
    </div>
    <table class="pathogen-detail-table table-center" ref="pathogenDetailTableRef">
      <tr class="header-row">
        <th colspan="16">病原体检测结果详细列表</th>
      </tr>
      <tr>
        <th colspan="2">类型</th>
        <th colspan="3">病原体</th>
        <th>结果</th>
        <th colspan="5">病原体</th>
        <th>结果</th>
        <th colspan="3">病原体</th>
        <th>结果</th>
      </tr>
      <!-- DNA病毒类 -->
      <tr>
        <td rowspan="5" colspan="2">DNA病毒类<br />(15种)</td>
        <td colspan="3">人腺病毒B组</td>
        <td>-</td>
        <td colspan="5">人疱疹病毒2型</td>
        <td>-</td>
        <td colspan="3">人疱疹病毒7型</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">人腺病毒C组</td>
        <td>-</td>
        <td colspan="5">水痘-带状疱疹病毒</td>
        <td>-</td>
        <td colspan="3">WU多瘤病毒</td>
        <td>-</td>
      </tr>
      <tr>
        <td colspan="3" class="td-first-item">人腺病毒E组</td>
        <td>-</td>
        <td colspan="5">EB病毒</td>
        <td>-</td>
        <td colspan="3">KI多瘤病毒</td>
        <td>-</td>
      </tr>
      <tr>
        <td colspan="3" class="td-first-item">人博卡病毒</td>
        <td>-</td>
        <td colspan="5">巨细胞病毒</td>
        <td>-</td>
        <td colspan="3">JC多瘤病毒</td>
        <td>-</td>
      </tr>
      <tr>
        <td colspan="3" class="td-first-item">人疱疹病毒1型</td>
        <td>-</td>
        <td colspan="5">人疱疹病毒6型</td>
        <td>-</td>
        <td colspan="3">BK多瘤病毒</td>
        <td>-</td>
      </tr>

      <!-- RNA病毒 -->
      <tr>
        <td rowspan="8" colspan="2">RNA病毒<br />(24种)</td>
        <td colspan="3">甲型流感病毒</td>
        <td>-</td>
        <td colspan="5">人冠状病毒229E</td>
        <td>-</td>
        <td colspan="3">柯萨奇病毒A6型</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">甲型流感病毒H1N1</td>
        <td>-</td>
        <td colspan="5">人呼吸道合胞病毒A型</td>
        <td>-</td>
        <td colspan="3">柯萨奇病毒A10型</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">甲型流感病毒H3N2</td>
        <td>-</td>
        <td colspan="5">人呼吸道合胞病毒B型</td>
        <td>-</td>
        <td colspan="3">柯萨奇病毒A16型</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">乙型流感病毒</td>
        <td>-</td>
        <td colspan="5">人呼吸道病毒1型(人副流感病毒1型)</td>
        <td>-</td>
        <td colspan="3">肠道病毒D68型</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">新型冠状病毒</td>
        <td>-</td>
        <td colspan="5">人腮腺炎病毒2型(人副流感病毒2型)</td>
        <td>-</td>
        <td colspan="3">肠道病毒A71型</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">人冠状病毒OC43</td>
        <td>-</td>
        <td colspan="5">人呼吸道病毒3型(人副流感病毒3型)</td>
        <td>-</td>
        <td colspan="3">麻疹病毒</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">人冠状病毒NL63</td>
        <td>-</td>
        <td colspan="5">人腮腺炎病毒4型(人副流感病毒4型)</td>
        <td>-</td>
        <td colspan="3">中东呼吸道综合征冠状病毒</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">人冠状病毒HKU1</td>
        <td>-</td>
        <td colspan="5">人偏肺病毒</td>
        <td>-</td>
        <td colspan="3">鼻病毒</td>
        <td>-</td>
      </tr>

      <!-- 革兰氏阳性菌 -->
      <tr>
        <td rowspan="8" colspan="2">革兰氏阳性菌<br />(22种)</td>
        <td colspan="3">金黄色葡萄球菌</td>
        <td>-</td>
        <td colspan="5">胞内分枝杆菌</td>
        <td>-</td>
        <td colspan="3">化脓链球菌</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">肺炎链球菌</td>
        <td>-</td>
        <td colspan="5">堪萨斯分枝杆菌</td>
        <td>-</td>
        <td colspan="3">圣乔治诺卡菌</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">星型诺卡菌</td>
        <td>-</td>
        <td colspan="5">偶发分枝杆菌</td>
        <td>-</td>
        <td colspan="3">皮疽诺卡菌</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">无乳链球菌</td>
        <td>-</td>
        <td colspan="5">脓肿分枝杆菌</td>
        <td>-</td>
        <td colspan="3">白喉棒杆菌</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">炭疽芽孢杆菌</td>
        <td>-</td>
        <td colspan="5">鸟分枝杆菌</td>
        <td>-</td>
        <td colspan="3">惠普尔养障体</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">屎肠球菌</td>
        <td>-</td>
        <td colspan="5">蟾分枝杆菌</td>
        <td>-</td>
        <td colspan="3">纹带棒杆菌</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">结核分枝杆菌复合群</td>
        <td>-</td>
        <td colspan="5">粪肠球菌</td>
        <td>-</td>
        <td colspan="3">马赛分枝杆菌</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">戈登分枝杆菌</td>
        <td>-</td>
        <td colspan="5"></td>
        <td></td>
        <td colspan="3"></td>
        <td></td>
      </tr>

      <!-- 革兰氏阴性菌 -->
      <tr>
        <td rowspan="8" colspan="2">革兰氏阴性菌<br />(23种)</td>
        <td colspan="3">流感嗜血杆菌</td>
        <td>-</td>
        <td colspan="5">产酸克雷伯菌</td>
        <td>-</td>
        <td colspan="3">奇异变形杆菌</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">铜绿假单胞菌</td>
        <td>-</td>
        <td colspan="5">产气克雷伯菌</td>
        <td>-</td>
        <td colspan="3">类鼻疽伯克霍尔德菌</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">肺炎克雷伯菌</td>
        <td>-</td>
        <td colspan="5">粘质沙雷氏菌</td>
        <td>-</td>
        <td colspan="3">副百日咳鲍特菌</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">卡他莫拉菌</td>
        <td>-</td>
        <td colspan="5">阴沟肠杆菌复合群</td>
        <td>-</td>
        <td colspan="3">多杀巴斯德菌</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">鲍曼不动杆菌</td>
        <td>-</td>
        <td colspan="5">医院不动杆菌</td>
        <td>-</td>
        <td colspan="3">百日咳鲍特菌</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">嗜麦芽窄食单胞菌</td>
        <td>-</td>
        <td colspan="5">洋葱伯克霍尔德菌</td>
        <td>-</td>
        <td colspan="3">脆弱拟杆菌</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">嗜肺军团菌</td>
        <td>-</td>
        <td colspan="5">新洋葱伯克霍尔德菌</td>
        <td>-</td>
        <td colspan="3">恙虫病东方体</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">大肠埃希菌</td>
        <td>-</td>
        <td colspan="5">鼠疫耶尔森氏菌</td>
        <td>-</td>
        <td colspan="3"></td>
        <td></td>
      </tr>

      <!-- 真菌 -->
      <tr>
        <td rowspan="6" colspan="2">真菌(18种)</td>
        <td colspan="3">耶氏肺孢子菌</td>
        <td>-</td>
        <td colspan="5">黄曲霉</td>
        <td>-</td>
        <td colspan="3">近平滑念珠菌</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">新型隐球菌</td>
        <td>-</td>
        <td colspan="5">黑曲霉</td>
        <td>-</td>
        <td colspan="3">耳念珠菌</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">格特隐球菌</td>
        <td>-</td>
        <td colspan="5">土曲霉</td>
        <td>-</td>
        <td colspan="3">小孢根霉</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">马尔尼菲篮状菌</td>
        <td>-</td>
        <td colspan="5">白念珠菌</td>
        <td>-</td>
        <td colspan="3">微小根毛霉</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">荚膜组织胞浆菌</td>
        <td>-</td>
        <td colspan="5">热带念珠菌</td>
        <td>-</td>
        <td colspan="3">少根根霉(米根霉)</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">烟曲霉</td>
        <td>-</td>
        <td colspan="5">光滑念珠菌</td>
        <td>-</td>
        <td colspan="3">库德里阿兹威毕赤酵母</td>
        <td>-</td>
      </tr>

      <!-- 菌属 -->
      <tr>
        <td rowspan="1" colspan="2">菌属(2种)</td>
        <td colspan="3">毛霉属</td>
        <td>-</td>
        <td colspan="5">布鲁菌属</td>
        <td>-</td>
        <td colspan="3"></td>
        <td></td>
      </tr>

      <!-- 其他 -->
      <tr>
        <td rowspan="2" colspan="2">特病原体<br />(5种)</td>
        <td colspan="3">肺炎支原体</td>
        <td>-</td>
        <td colspan="5">鹦鹉热衣原体</td>
        <td>-</td>
        <td colspan="3">卫氏并殖吸虫(肺吸虫)</td>
        <td>-</td>
      </tr>
      <tr>
        <td class="td-first-item" colspan="3">肺炎衣原体</td>
        <td>-</td>
        <td colspan="5">贝纳柯克斯体</td>
        <td>-</td>
        <td colspan="3"></td>
        <td></td>
      </tr>
    </table>


    <div class="pdf-page-break">
    </div>
    <!-- 耐药基因检测详细列表 -->
    <table class="resistance-gene-table table-center" style="margin-bottom: 0">
      <tr class="header-row">
        <th colspan="2">耐药基因检测范围详细列表</th>
      </tr>
      <tr>
        <th>类别</th>
        <th>耐药基因</th>
      </tr>
      <tr>
        <td>A类碳青霉烯酶</td>
        <td>KPC</td>
      </tr>
      <tr>
        <td rowspan="3">B类金属β内酰胺酶</td>
        <td>VIM</td>
      </tr>
      <tr>
        <td class="td-first-item">IMP</td>
      </tr>
      <tr>
        <td class="td-first-item">NDM</td>
      </tr>

      <tr>
        <td rowspan="2">D类碳青霉烯酶</td>
        <td>OXA-23</td>
      </tr>
      <tr>
        <td class="td-first-item">OXA-48</td>
      </tr>
      <tr>
        <td rowspan="2">头孢菌素耐药基因</td>
        <td>TEM-1</td>
      </tr>
      <tr>
        <td class="td-first-item">CTX-M</td>
      </tr>

      <tr>
        <td rowspan="1">耐甲氧西林金黄色葡萄球菌(MRSA)</td>
        <td>mecA</td>
      </tr>

      <tr>
        <td rowspan="2">万古霉素耐药基因</td>
        <td>vanA</td>
      </tr>
      <tr>
        <td class="td-first-item">vanB</td>
      </tr>
      <tr>
        <td>质粒介导的多粘菌素耐药基因</td>
        <td>MCR-1</td>
      </tr>
    </table>

    <!-- 突变体详细列表 -->
    <table class="mutation-detail-table table-center" style="margin-bottom: 0">
      <tr class="header-row">
        <th colspan="2">
          肺炎支原体和百日咳鲍特菌相关耐药基因突变位点检测范围详细列表
        </th>
      </tr>
      <tr>
        <th>类别</th>
        <th>耐药基因</th>
      </tr>
      <tr>
        <td rowspan="4">肺炎支原体23SrRNA基因</td>
        <td class="td-first-item">A2063G</td>
      </tr>
      <tr>
        <td class="td-first-item">A2064G</td>
      </tr>
      <tr>
        <td class="td-first-item">A2067G</td>
      </tr>
      <tr>
        <td class="td-first-item">C2617G</td>
      </tr>
      <tr>
        <td rowspan="1">百日核鲍特菌23SrRNA基因</td>
        <td class="td-first-item">A2047G</td>
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
// 检出耐药基因列表数据
const resistanceGeneList = ref<
  {
    geneName: string;
    normalizedSeq: string | number;
    associatedPathogen: string;
    geneDescription: string;
  }[]
>(
  props.report.genes.map((item) => {
    return {
      geneName: item.pathogenCnSname!,
      normalizedSeq: item.levellingReads!,
      associatedPathogen: item.subPathogen!,
      geneDescription: item.pathogenComments!,
    };
  })
);

// 检出肺炎支原体和百日咳鲍特菌相关耐药基因突变位点列表数据
const mutationList = ref<
  {
    geneName: string;
    resistanceResult: string;
    normalizedSeq: string | number;
    mutationFrequency: string | number;
    associatedPathogen: string;
    geneDescription: string;
  }[]
>(
  props.report.geneMutationss.map((item) => {
    return {
      geneName: item.geneName!,
      resistanceResult: item.checkResult!,
      normalizedSeq: item.levellingReads!,
      mutationFrequency: item.mutationRate ? item.mutationRate! + "%" : "",
      associatedPathogen: item.subPathogen!,
      geneDescription: item.pathogenComments!,
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

const pathogenDetailTableRef = ref<HTMLTableElement>();

const statisticsRef = ref();

onMounted(() => {
  pathogenDetailTableRef.value?.querySelectorAll("td").forEach((td) => {
    const name = td.innerText.trim();

    if (props.report.outPathogenNames.indexOf(name) !== -1) {
      td.classList.add("highlight-cell");
      const next = td.nextElementSibling as HTMLElement;
      if (next) {
        next.classList.add("highlight-cell");
        next.innerText = "+";
      }
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