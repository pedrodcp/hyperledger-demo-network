/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction processor function.
 * @param {org.demo.demonetwork.SampleTransaction} tx The sample transaction instance.
 * @transaction
 */
async function sampleTransaction(tx) {  // eslint-disable-line no-unused-vars

    // Save the old value of the asset.
    const oldValue = tx.asset.value;

    // Update the asset with the new value.
    tx.asset.value = tx.newValue;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.demo.demonetwork.ProductAsset');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.demo.demonetwork', 'SampleEvent');
    event.asset = tx.asset;
    event.oldValue = oldValue;
    event.newValue = tx.newValue;
    emit(event);
}

/**
 * ProductTransaction processor function.
 * @param {org.demo.demonetwork.ProductTransaction} tx 
 * @transaction
 */
async function productTransaction(tx) {  // eslint-disable-line no-unused-vars
    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.demo.demonetwork', 'ProductBuyingEvent');
    event.asset = tx.asset;
    event.buyer = tx.buyer;
    event.seller = tx.seller;
  	event.quantity = tx.quantity;
    emit(event);
  
    await getAssetRegistry('org.demo.demonetwork.ConfidenceAsset').then(function (confidenceAssetRegistry){
        return confidenceAssetRegistry.getAll();
      }).then(function (confidence) {
        confidence.forEach(function (c) {
          if(c.owner === tx.buyer){
            const oldValue = c.value;
            c.value = c.value + 0.1;
            assetRegistry.update(c);
            //emit event
            let confidenceEvent = getFactory().newEvent('org.demo.demonetwork', 'ConficenceUpdateEvent');
            confidenceEvent.asset = c;
            confidenceEvent.oldValue = oldValue;
            confidenceEvent.seller = c.value;
            emit(confidenceEvent);
          }
        });
      }).catch(function (error) {
      console.log(error);
      console.log("error getting assets (confidence)");
    });
}

